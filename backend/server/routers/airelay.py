"""
wb-ai-gateway —— 站点自建 AI 网关（sub2api 风格：上游账号池 → OpenAI 兼容 API → 用户密钥分发）

频道/上游（ai_upstreams 表，管理员可增删）：
  kind = "openai"     任意 OpenAI 兼容端点（网页号转 API 服务、官方 API、中转站），
                      accounts = [api_key1, api_key2, ...]
  kind = "doubao-web" 豆包网页版原生协议（www.doubao.com/samantha/chat/completion），
                      accounts = [sessionid1, sessionid2, ...]

调度（sub2api 核心思想）：
  - 每次请求在"支持该模型且启用"的上游里按 id 顺序挑；
  - 上游内部账号按轮询(round-robin)挑健康号；
  - 失败自动换号：401/403 冷却 30min（号挂了）、429 冷却 90s（限流）、
    5xx 冷却 120s、网络/超时 冷却 60s；一个号失败立刻换下一个，上游全灭换下一个上游；
  - 所有上游都灭才返回 503。

对访客：
  POST /v1/chat/completions   Bearer sk-wb-xxx（OpenAI 兼容，流式/非流式）
  GET  /v1/models             Bearer sk-wb-xxx
对登录用户：
  GET/POST/DELETE /api/ai-gw/keys...   密钥自助管理
  POST /api/ai-gw/playground           站内试用（走同一网关管线，独立限额）
对站长（X-Admin-Token，token 在服务器 .env AI_GW_ADMIN_TOKEN）：
  GET/POST/DELETE /api/ai-gw/admin/upstreams...  频道与账号池管理 + 一键验号

说明：流式响应为统一重打包的 OpenAI chunk（文本对话场景，不透传 tool_calls）。
"""
import hashlib
import json
import os
import secrets
import threading
import time
import uuid

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy import text as sql_text
from sqlalchemy.orm import Session

from ..database import engine, get_db
from ..models.db_models import User
from ..services.auth_service import get_current_user
from ..ratelimit import limit

router = APIRouter(tags=["AI网关"])

# 常驻上游连接池：避免每次请求重建 TLS（豆包握手 ~0.3s）；h2 可用时自动启用 HTTP/2
_shared_client = None
_shared_lock = threading.Lock()


def _shared_cm():
    class _CM:
        async def __aenter__(self):
            global _shared_client
            if _shared_client is None:
                with _shared_lock:
                    if _shared_client is None:
                        try:
                            import h2  # noqa: F401
                            http2 = True
                        except ImportError:
                            http2 = False
                        _shared_client = httpx.AsyncClient(
                            http2=http2,
                            follow_redirects=True,
                            timeout=httpx.Timeout(GW_TIMEOUT, connect=10),
                            limits=httpx.Limits(max_keepalive_connections=20,
                                                keepalive_expiry=300),
                        )
            return _shared_client

        async def __aexit__(self, *exc):
            return False
    return _CM()

GW_TIMEOUT = float(os.environ.get("AI_TIMEOUT") or "120")
ADMIN_TOKEN = (os.environ.get("AI_GW_ADMIN_TOKEN") or "").strip()
KEY_PREFIX = "sk-wb-"
MAX_KEYS_PER_USER = 5
# 账号失败冷却（秒）
COOLDOWN = {401: 1800, 403: 1800, 429: 90}

# ---------------------------------------------------------------- 表（幂等，首次访问时建）
_table_lock = threading.Lock()
_tables_ready = False

_DDL = [
    """CREATE TABLE IF NOT EXISTS ai_upstreams (
        id SERIAL PRIMARY KEY,
        name VARCHAR(64) UNIQUE NOT NULL,
        kind VARCHAR(24) NOT NULL DEFAULT 'openai',
        base_url VARCHAR(300) NOT NULL DEFAULT '',
        accounts JSONB NOT NULL DEFAULT '[]'::jsonb,
        models JSONB NOT NULL DEFAULT '[]'::jsonb,
        enabled BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        last_ok_at TIMESTAMPTZ,
        last_err TEXT NOT NULL DEFAULT ''
    )""",
    """CREATE TABLE IF NOT EXISTS ai_keys (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(64) NOT NULL DEFAULT '默认密钥',
        key_hash VARCHAR(64) NOT NULL UNIQUE,
        key_prefix VARCHAR(24) NOT NULL DEFAULT '',
        enabled BOOLEAN NOT NULL DEFAULT TRUE,
        rpm INTEGER NOT NULL DEFAULT 15,
        daily_limit INTEGER NOT NULL DEFAULT 300,
        used_today INTEGER NOT NULL DEFAULT 0,
        usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
        total_calls BIGINT NOT NULL DEFAULT 0,
        total_tokens BIGINT NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        last_used_at TIMESTAMPTZ
    )""",
    """CREATE INDEX IF NOT EXISTS idx_ai_keys_user ON ai_keys(user_id)""",
    """CREATE TABLE IF NOT EXISTS ai_usage_log (
        id BIGSERIAL PRIMARY KEY,
        key_id INTEGER NOT NULL DEFAULT -1,
        user_id INTEGER NOT NULL DEFAULT -1,
        model VARCHAR(64) NOT NULL DEFAULT '',
        upstream VARCHAR(64) NOT NULL DEFAULT '',
        ok BOOLEAN NOT NULL DEFAULT TRUE,
        prompt_tokens INTEGER NOT NULL DEFAULT 0,
        completion_tokens INTEGER NOT NULL DEFAULT 0,
        latency_ms INTEGER NOT NULL DEFAULT 0,
        err VARCHAR(200) NOT NULL DEFAULT '',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )""",
    """CREATE INDEX IF NOT EXISTS idx_ai_usage_key_time ON ai_usage_log(key_id, created_at)""",
]


def ensure_tables():
    global _tables_ready
    if _tables_ready:
        return
    with _table_lock:
        if _tables_ready:
            return
        with engine.connect() as conn:
            for ddl in _DDL:
                conn.execute(sql_text(ddl))
            conn.commit()
        _seed_from_env()
        _tables_ready = True


def _seed_from_env():
    """把 .env 里的账号种子同步进 upstreams（幂等：只在频道不存在时创建）。"""
    sids = [x.strip() for x in (os.environ.get("AI_GW_DOUBAO_SESSIONS") or "").split(",") if x.strip()]
    if sids:
        _seed_upstream("豆包网页版", "doubao-web", "", sids, ["doubao-web"])
    obase = (os.environ.get("AI_GW_OPENAI_BASE") or "").strip()
    okeys = [x.strip() for x in (os.environ.get("AI_GW_OPENAI_KEYS") or "").split(",") if x.strip()]
    omodels = [x.strip() for x in (os.environ.get("AI_GW_OPENAI_MODELS") or "gpt-4o-mini").split(",") if x.strip()]
    if obase and okeys:
        _seed_upstream("网页号池", "openai", obase.rstrip("/"), okeys, omodels)


def _seed_upstream(name, kind, base, accounts, models):
    with engine.connect() as conn:
        row = conn.execute(sql_text("SELECT id FROM ai_upstreams WHERE name=:n"), {"n": name}).first()
        if row:
            return
        conn.execute(sql_text(
            "INSERT INTO ai_upstreams (name, kind, base_url, accounts, models) "
            "VALUES (:n,:k,:b,CAST(:a AS jsonb),CAST(:m AS jsonb))"),
            {"n": name, "k": kind, "b": base, "a": json.dumps(accounts), "m": json.dumps(models)})
        conn.commit()


# ---------------------------------------------------------------- 调度器：轮询 + 失败冷却换号
_rr = {}            # upstream_id -> 最近使用的账号下标
_cooldown = {}      # (upstream_id, account_idx) -> 冷却截止时间戳
_sched_lock = threading.Lock()


def _pick(up, accounts):
    """round-robin 挑一个健康账号（未被冷却覆盖的）；全灭返回 -1。"""
    now = time.time()
    healthy = [i for i in range(len(accounts)) if _cooldown.get((up["id"], i), 0) <= now]
    if not healthy:
        return -1
    with _sched_lock:
        last = _rr.get(up["id"], -1)
        nxt = healthy[0]
        for i in healthy:
            if i > last:
                nxt = i
                break
        _rr[up["id"]] = nxt
    return nxt


def _mark_fail(up, idx, status=0, note=""):
    cd = COOLDOWN.get(status, 120 if status and status >= 500 else 60)
    with _sched_lock:
        _cooldown[(up["id"], idx)] = time.time() + cd
    _set_last_err(up, "[%s] %s" % (status or "net", note[:160]))


def _mark_ok(up, idx):
    with _sched_lock:
        _cooldown.pop((up["id"], idx), None)
    try:
        with engine.connect() as conn:
            conn.execute(sql_text("UPDATE ai_upstreams SET last_ok_at=now(), last_err='' WHERE id=:i"),
                         {"i": up["id"]})
            conn.commit()
    except Exception:
        pass


def _set_last_err(up, note):
    try:
        with engine.connect() as conn:
            conn.execute(sql_text("UPDATE ai_upstreams SET last_err=:e WHERE id=:i"),
                         {"e": note[:200], "i": up["id"]})
            conn.commit()
    except Exception:
        pass


def _load_upstreams(db: Session):
    rows = db.execute(sql_text(
        "SELECT id, name, kind, base_url, accounts, models FROM ai_upstreams "
        "WHERE enabled ORDER BY id")).mappings().all()
    out = []
    for r in rows:
        try:
            accounts = r["accounts"] if isinstance(r["accounts"], list) else json.loads(r["accounts"] or "[]")
            models = r["models"] if isinstance(r["models"], list) else json.loads(r["models"] or "[]")
        except Exception:
            accounts, models = [], []
        out.append({"id": r["id"], "name": r["name"], "kind": r["kind"],
                    "base": (r["base_url"] or "").rstrip("/"),
                    "accounts": [str(a) for a in accounts], "models": list(models)})
    return out


def _resolve(upstreams, model):
    return [u for u in upstreams if model in u["models"]]


# ---------------------------------------------------------------- 豆包网页版原生客户端
_DOUBAO_HEADERS = {
    "Accept": "*/*",
    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "Cache-Control": "no-cache",
    "Origin": "https://www.doubao.com",
    "Pragma": "no-cache",
    "Referer": "https://www.doubao.com/chat/",
    "Sec-Ch-Ua": '"Chromium";v="154", "Microsoft Edge";v="154", "Not A(Brand";v="99"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                   "(KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36 Edg/154.0.0.0"),
    "agw-js-conv": "str, str",
}


def _doubao_merge_text(messages):
    """豆包 completion 接口只认一条消息：把多轮对话合并为一段带角色标记的文本。"""
    parts = []
    for m in messages:
        role = {"system": "system", "assistant": "assistant", "user": "user"}.get(m.get("role"), "user")
        content = m.get("content", "")
        if isinstance(content, list):
            content = "\n".join(x.get("text", "") for x in content
                                if isinstance(x, dict) and x.get("type") == "text")
        parts.append("<|im_start|>%s\n%s\n<|im_end|>" % (role, str(content)))
    return "\n".join(parts) + "\n"


DOUBAO_FP = {
    "device_id": "7655723269241226752",
    "web_id": "7655723292002829862",
    "tea_uuid": "7655723292002829862",
    "fp": "verify_mtb94ux4_XVSReRSs_xkEN_4xot_AEFp_QuuWnVuCce8z",
    "msToken": "5nDNkduEA7eSbXetuVXpQ4jr1sul_93PHrIwr0BPzHFrPajYLfwAyz_i6gY1lzrJOQ3IHgs7tqjB6gW3duTfR1yK6DIAQVAb59GEvQih0pwKJrYaLeLrTbGeOtNzdSVQ07I-5RlD0eRIeZyKIq18hmIYoaI_t3Ys4A2EdbVGqChHLOwmFlGldGZqvg==",
}


def _doubao_query():
    return {
        "aid": "497858", "real_aid": "497858", "channel": "hw_db_itab",
        "device_id": DOUBAO_FP["device_id"], "device_platform": "web",
        "doubao_device_platform": "web", "doubao_pc_version": "3.39.0",
        "fp": DOUBAO_FP["fp"], "language": "zh",
        "pc_version": "3.39.0", "pkg_type": "release_version",
        "region": "CN", "sys_region": "CN", "samantha_web": 1,
        "tea_uuid": DOUBAO_FP["tea_uuid"], "tz_name": "Asia/Shanghai",
        "use-olympus-account": 1, "version_code": "20800",
        "web_id": DOUBAO_FP["web_id"], "web_platform": "browser",
        "web_tab_id": str(uuid.uuid4()),
        "msToken": DOUBAO_FP["msToken"],
    }


class UpstreamError(Exception):
    def __init__(self, status, message):
        super().__init__(message)
        self.status = status
        self.message = message


def _cookie_jar(acct):
    """账号串兼容两种形态：
    - 纯 sessionid（32位hex）→ 自动补 sessionid/sessionid_ss 双 cookie
    - 完整 Cookie 串（含 ; 和 =）→ 原样使用，缺 sessionid 时从 sid_guard 提取补上"""
    a = (acct or "").strip()
    if ";" in a and "=" in a:
        jar = a
        has = {}
        for part in jar.split(";"):
            if "=" in part:
                k, v = part.split("=", 1)
                has[k.strip()] = v.strip()
        sid = has.get("sessionid") or has.get("sid_tt") or \
              (has.get("sid_guard", "").split("%7C")[0].split("|")[0])
        if sid and "sessionid" not in has:
            jar += "; sessionid=%s; sessionid_ss=%s" % (sid, sid)
        return jar
    return "sessionid=%s; sessionid_ss=%s" % (a, a)


async def _doubao_headers(acct):
    h = dict(_DOUBAO_HEADERS)
    h["Cookie"] = _cookie_jar(acct)
    h["X-Flow-Trace"] = "04-%s-%s-01" % (uuid.uuid4(), uuid.uuid4().hex[:16])
    return h


async def doubao_chat_stream(sid, messages):
    """豆包网页版：yield 增量文本。协议对齐网页端 Chrome 131 指纹。"""
    merged = _doubao_merge_text(messages)
    now_ms = int(time.time() * 1000)
    body = {
        "messages": [{
            "content": json.dumps({"text": merged}, ensure_ascii=False),
            "content_type": 2001,
            "attachments": [],
            "references": [],
        }],
        "completion_option": {
            "is_regen": False, "with_suggest": True, "need_create_conversation": True,
            "launch_stage": 1, "is_replace": False, "is_delete": False,
            "message_from": 0, "action_bar_skill_id": 0, "use_deep_think": False,
            "use_auto_cot": False, "resend_for_regen": False,
            "enable_commerce_credit": False, "event_id": "0",
        },
        "evaluate_option": {"web_ab_params": ""},
        "section_id": "26" + "".join(secrets.choice("0123456789") for _ in range(16)),
        "conversation_id": "0",
        "local_conversation_id": "local_16" + "".join(secrets.choice("0123456789") for _ in range(14)),
        "local_message_id": uuid.uuid4().hex,
    }
    _unused_new_schema = {
        "client_meta": {
            "conversation_id": "0",
            "bot_id": "7338286299411103781",
            "local_permissions": [
                {"permission_name": "ACCESS_COARSE_LOCATION", "status": 3},
                {"permission_name": "ACCESS_FINE_LOCATION", "status": 3},
                {"permission_name": "ACCESS_BACKGROUND_LOCATION", "status": 3},
            ],
        },
        "messages": [{
            "local_message_id": str(uuid.uuid4()),
            "content_block": [{
                "block_type": 10000,
                "content": {"text_block": {"text": merged, "icon_url": "", "icon_url_dark": "", "summary": ""},
                            "pc_event_block": ""},
                "block_id": str(uuid.uuid4()),
                "parent_id": "",
                "meta_info": [],
                "append_fields": [],
            }],
            "message_status": 0,
        }],
        "option": {
            "send_message_scene": "", "create_time_ms": now_ms, "collect_id": "", "is_audio": False,
            "answer_with_suggest": False, "agent_mode": 2, "tts_switch": False, "need_deep_think": 0,
            "click_clear_context": False, "from_suggest": False, "is_regen": False, "is_replace": False,
            "is_from_click_option": False, "is_from_click_softlink": False, "disable_sse_cache": False,
            "select_text_action": "", "is_select_text": False, "resend_for_regen": False, "scene_type": 0,
            "unique_key": str(uuid.uuid4()), "start_seq": 0, "need_create_conversation": True,
            "regen_query_id": [], "edit_query_id": [], "regen_instruction": "",
            "no_replace_for_regen": False, "message_from": 0, "shared_app_name": "", "shared_app_id": "",
            "sse_recv_event_options": {"support_chunk_delta": True},
            "support_lazy_fetch_stream": True, "is_ai_playground": False, "is_old_user": True,
            "general_task_param": {"runtime_type": 0, "agent_task_param": {},
                                   "agent_task_param_change": {"runtime_changed": False, "device_changed": False,
                                                               "sandbox_auth_type_changed": False},
                                   "project_id": "", "need_modify_conversation": False},
            "recovery_option": {"is_recovery": False, "req_create_time_sec": int(time.time()),
                                "append_sse_event_scene": 0},
            "message_storage_type": 0, "related_deleted_message_ids": {}, "connector_info_list": [],
            "model_config": {"model_item_key": "0", "model_extra_params": {}, "reasoning_effort": 3},
            "aggregate_params": {"mention_skill_list": "[]", "mention_plugin_list": "[]",
                                 "mention_ext": "[{}]", "conversation_mode": "", "mode_id": "1",
                                 "model_item_key": "0", "agent_mode": "2", "reasoning_effort": "3",
                                 "provider_id": ""},
        },
        "user_context": [],
        "ext": {"agent_mode": "2", "use_deep_think": "0",
                "general_task_param": json.dumps({"runtime_type": 0, "agent_task_param": {},
                                                  "agent_task_param_change": {"runtime_changed": False,
                                                                              "device_changed": False,
                                                                              "sandbox_auth_type_changed": False},
                                                  "project_id": "", "need_modify_conversation": False},
                                                 ensure_ascii=False),
                "collection_id": "", "is_finish": "1", "commerce_credit_config_enable": "0"},
    }
    headers = await _doubao_headers(sid)
    conv_id = ""
    got_piece = [False]
    async with _shared_cm() as client:
        async with client.stream(
                "POST", "https://www.doubao.com/samantha/chat/completion",
                params=_doubao_query(), headers=headers, json=body) as r:
            if r.status_code != 200:
                snippet = (await r.aread())[:200].decode("utf-8", "replace")
                raise UpstreamError(r.status_code, "doubao http %s: %s" % (r.status_code, snippet))
            ctype = r.headers.get("content-type", "")
            if "text/event-stream" not in ctype:
                raw = (await r.aread())[:200].decode("utf-8", "replace")
                raise UpstreamError(502, "doubao 非 SSE 响应: %s" % raw)
            buf = ""
            ev_name = ""
            async for chunk in r.aiter_text():
                buf += chunk
                while "\n" in buf:
                    line, buf = buf.split("\n", 1)
                    line = line.strip()
                    if line.startswith("event:"):
                        ev_name = line[6:].strip()
                        continue
                    if not line.startswith("data:"):
                        continue
                    payload = line[5:].strip()
                    if payload == "[DONE]":
                        return
                    try:
                        ev = json.loads(payload)
                    except Exception:
                        continue
                    # 新版命名事件：STREAM_ERROR / SSE_HEARTBEAT
                    if ev_name == "STREAM_ERROR" or "error_code" in ev:
                        raise UpstreamError(502, "doubao %s-%s" % (
                            ev.get("error_code", ev.get("code")), ev.get("error_msg", ev.get("message", ""))))
                    if ev.get("code"):
                        raise UpstreamError(502, "doubao %s-%s" % (ev.get("code"), ev.get("message", "")))
                    et = ev.get("event_type")
                    if et == 2003:
                        return
                    if et is not None and et != 2001:
                        continue
                    raw = ev.get("event_data")
                    if raw is None:
                        continue
                    try:
                        data = json.loads(raw) if isinstance(raw, str) else raw
                    except Exception:
                        continue
                    if not conv_id and data.get("conversation_id"):
                        conv_id = str(data["conversation_id"])
                    if data.get("is_finish"):
                        return
                    msg = data.get("message") or {}
                    content = msg.get("content")
                    if not content:
                        continue
                    piece = ""
                    try:
                        parsed = json.loads(content)
                        if isinstance(parsed, str):
                            piece = parsed
                        elif isinstance(parsed, dict):
                            piece = (parsed.get("text")
                                     or (parsed.get("delta") or {}).get("text")
                                     or parsed.get("content") or "")
                    except Exception:
                        piece = content if isinstance(content, str) else ""
                    if piece:
                        got_piece[0] = True
                        yield piece
    if not got_piece[0]:
        raise UpstreamError(502, "doubao 空响应（无增量事件）")
    # 结束后清理会话，避免出现在账号的对话列表里
    if conv_id:
        try:
            async with _shared_cm() as c:
                await c.post("https://www.doubao.com/samantha/thread/delete",
                             params=_doubao_query(), headers=headers,
                             json={"conversation_id": conv_id})
        except Exception:
            pass


async def openai_chat_stream(base, key, model, messages, extra=None):
    """OpenAI 兼容上游：转发并解出增量文本。"""
    extra = extra or {}
    payload = {"model": model, "messages": messages, "stream": True}
    if isinstance(extra.get("max_tokens"), int):
        payload["max_tokens"] = extra["max_tokens"]
    if isinstance(extra.get("temperature"), (int, float)):
        payload["temperature"] = extra["temperature"]
    headers = {"Authorization": "Bearer %s" % key, "Content-Type": "application/json"}
    async with _shared_cm() as client:
        async with client.stream("POST", "%s/chat/completions" % base,
                                 headers=headers, json=payload) as r:
            if r.status_code != 200:
                snippet = (await r.aread())[:200].decode("utf-8", "replace")
                raise UpstreamError(r.status_code, "upstream http %s: %s" % (r.status_code, snippet))
            buf = ""
            async for chunk in r.aiter_text():
                buf += chunk
                while "\n" in buf:
                    line, buf = buf.split("\n", 1)
                    line = line.strip()
                    if not line.startswith("data:"):
                        continue
                    data = line[5:].strip()
                    if data == "[DONE]":
                        return
                    try:
                        j = json.loads(data)
                    except Exception:
                        continue
                    if j.get("error"):
                        raise UpstreamError(502, str(j["error"])[:160])
                    choices = j.get("choices") or [{}]
                    delta = (choices[0].get("delta") or {})
                    piece = delta.get("content") or ""
                    if piece:
                        yield piece


# ---------------------------------------------------------------- 密钥
def _hash_key(k):
    return hashlib.sha256(k.encode()).hexdigest()


class KeyIn(BaseModel):
    name: str = Field(default="默认密钥", max_length=64)


@router.get("/api/ai-gw/overview")
def overview(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ensure_tables()
    ups = _load_upstreams(db)
    models = []
    for u in ups:
        for m in u["models"]:
            models.append({"id": m, "upstream": u["name"], "kind": u["kind"]})
    keys = db.execute(sql_text(
        "SELECT id, name, key_prefix, enabled, rpm, daily_limit, used_today, "
        "(usage_date=CURRENT_DATE) AS today_valid, total_calls, total_tokens, "
        "created_at, last_used_at FROM ai_keys WHERE user_id=:u ORDER BY id"),
        {"u": user.id}).mappings().all()
    return {"models": models, "base_url": "/v1",
            "keys": [dict(k) for k in keys], "max_keys": MAX_KEYS_PER_USER}


@router.post("/api/ai-gw/keys")
def create_key(payload: KeyIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ensure_tables()
    n = db.execute(sql_text("SELECT count(*) FROM ai_keys WHERE user_id=:u"), {"u": user.id}).scalar_one()
    if n >= MAX_KEYS_PER_USER:
        raise HTTPException(400, detail={"code": "KEY_LIMIT",
                                         "message": "每人最多 %d 把密钥" % MAX_KEYS_PER_USER})
    raw = _gen_key()
    prefix = raw[:14] + "..."
    row = db.execute(sql_text(
        "INSERT INTO ai_keys (user_id, name, key_hash, key_prefix) "
        "VALUES (:u,:n,:h,:p) RETURNING id, created_at"),
        {"u": user.id, "n": payload.name.strip() or "默认密钥",
         "h": _hash_key(raw), "p": prefix})
    kid, created = row.first()
    db.commit()
    return {"id": kid, "key": raw, "name": payload.name, "prefix": prefix, "created_at": str(created)}


def _gen_key():
    return KEY_PREFIX + secrets.token_hex(16)


@router.delete("/api/ai-gw/keys/{kid}")
def delete_key(kid: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ensure_tables()
    r = db.execute(sql_text("DELETE FROM ai_keys WHERE id=:k AND user_id=:u"), {"k": kid, "u": user.id})
    db.commit()
    if r.rowcount < 1:
        raise HTTPException(404, detail={"code": "NOT_FOUND", "message": "密钥不存在"})
    return {"ok": True}


@router.post("/api/ai-gw/keys/{kid}/toggle")
def toggle_key(kid: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ensure_tables()
    db.execute(sql_text("UPDATE ai_keys SET enabled = NOT enabled WHERE id=:k AND user_id=:u"),
               {"k": kid, "u": user.id})
    db.commit()
    return {"ok": True}


# ---------------------------------------------------------------- PlayGround（登录即用，独立限额）
class PlayIn(BaseModel):
    model: str = Field(..., max_length=64)
    messages: list = Field(..., max_length=96)


@router.post("/api/ai-gw/playground")
async def playground(payload: PlayIn, request: Request, user: User = Depends(get_current_user),
                     db: Session = Depends(get_db)):
    ensure_tables()
    limit(request, "ai_gw_play", 30, 3600, "试用额度每小时 30 次，明天再来～")
    prompt_chars = sum(len(str(m.get("content", ""))) for m in payload.messages)
    return StreamingResponse(
        _stream_gen(_resolve(_load_upstreams(db), payload.model), payload.model,
                    payload.messages, -1, user.id, prompt_chars, time.time()),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-store", "X-Accel-Buffering": "no"},
    )


# ---------------------------------------------------------------- OpenAI 兼容入口
@router.get("/v1/models")
def v1_models(request: Request, db: Session = Depends(get_db)):
    ensure_tables()
    _auth_key(request, db)
    ups = _load_upstreams(db)
    return {"object": "list", "data": [
        {"id": m, "object": "model", "owned_by": u["name"]}
        for u in ups for m in u["models"]
    ]}


@router.post("/v1/chat/completions")
async def v1_chat(request: Request, db: Session = Depends(get_db)):
    ensure_tables()
    key_row = _auth_key(request, db)
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(400, detail={"message": "invalid json body"})
    model = str(body.get("model") or "")[:64]
    messages = body.get("messages") or []
    if not model or not messages:
        raise HTTPException(400, detail={"message": "model and messages are required"})
    _key_rate_limit(request, key_row)
    _key_daily_quota(db, key_row)
    prompt_chars = sum(len(str(m.get("content", ""))) for m in messages)

    if body.get("stream"):
        return StreamingResponse(
            _stream_gen(_resolve(_load_upstreams(db), model), model,
                        messages, key_row["id"], key_row["user_id"], prompt_chars, time.time()),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-store", "X-Accel-Buffering": "no"},
        )

    # 非流式：聚合所有增量
    parts, fail = [], ""
    async for kind, piece, err in _account_rotate(_resolve(_load_upstreams(db), model), model,
                                                  messages, key_row["id"], key_row["user_id"],
                                                  prompt_chars, time.time()):
        if kind == "piece":
            parts.append(piece)
        elif kind == "error":
            fail = err or "上游中断"
            break
        elif kind == "fail":
            fail = err or "全部上游暂不可用"
            break
    if not parts:
        return JSONResponse(status_code=503,
                            content={"error": {"message": fail, "type": "upstream_error"}})
    text = "".join(parts)
    p_tok, c_tok = max(1, prompt_chars // 3), max(1, len(text) // 2)
    return {
        "id": "wb-" + uuid.uuid4().hex[:12], "object": "chat.completion",
        "created": int(time.time()), "model": model,
        "choices": [{"index": 0,
                     "message": {"role": "assistant", "content": text},
                     "finish_reason": "stop"}],
        "usage": {"prompt_tokens": p_tok, "completion_tokens": c_tok, "total_tokens": p_tok + c_tok},
    }


def _auth_key(request: Request, db: Session):
    auth = request.headers.get("authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(401, detail={"message": "missing bearer key"})
    raw = auth[7:].strip()
    if not raw.startswith(KEY_PREFIX):
        raise HTTPException(401, detail={"message": "invalid key format"})
    row = db.execute(sql_text(
        "SELECT id, user_id, enabled, rpm, daily_limit, used_today, "
        "(usage_date=CURRENT_DATE) AS today_valid FROM ai_keys WHERE key_hash=:h"),
        {"h": _hash_key(raw)}).mappings().first()
    if not row or not row["enabled"]:
        raise HTTPException(401, detail={"message": "invalid or disabled key"})
    return row


def _key_rate_limit(request: Request, key_row):
    limit(request, "aikey:%d" % key_row["id"], int(key_row["rpm"] or 15), 60,
          "请求太快，Key 每分钟限 %d 次" % (key_row["rpm"] or 15))


def _key_daily_quota(db: Session, key_row):
    if not key_row["today_valid"]:
        db.execute(sql_text("UPDATE ai_keys SET used_today=0, usage_date=CURRENT_DATE WHERE id=:k"),
                   {"k": key_row["id"]})
        db.commit()
        used = 0
    else:
        used = key_row["used_today"]
    if used >= (key_row["daily_limit"] or 300):
        raise HTTPException(429, detail={"message": "今日额度已用完（%d 次），明天再来"
                                         % (key_row["daily_limit"] or 300)})


# ---------------------------------------------------------------- 网关核心
def _sse_chunk(model, first=False, piece=None, finish=None):
    if first:
        delta = {"role": "assistant", "content": ""}
    elif finish is not None:
        delta = {}
    else:
        delta = {"content": piece or ""}
    return "data: " + json.dumps({
        "id": "wb-gw-" + uuid.uuid4().hex[:8], "model": model,
        "object": "chat.completion.chunk",
        "choices": [{"index": 0, "delta": delta, "finish_reason": finish}],
        "created": int(time.time()),
    }, ensure_ascii=False) + "\n\n"


async def _account_rotate(cands, model, messages, key_id, user_id, prompt_chars, t0):
    """遍历候选上游 × 健康账号，yield (kind, piece, err)；
    kind: piece=增量文本 / error=已开流后中断 / fail=全部不可用。
    成功结束时记一次用量。"""
    last_err = "no healthy account"
    for u in cands:
        accounts = u["accounts"]
        tried = 0
        while tried < len(accounts):
            idx = _pick(u, accounts)
            if idx < 0:
                break
            tried += 1
            acct = accounts[idx]
            started = False
            acc_text = []
            try:
                if u["kind"] == "doubao-web":
                    agen = doubao_chat_stream(acct, messages)
                else:
                    agen = openai_chat_stream(u["base"], acct, model, messages, {})
                async for piece in agen:
                    if not started:
                        started = True
                        _mark_ok(u, idx)
                    acc_text.append(piece)
                    yield ("piece", piece, None)
                if started:
                    _log_usage(key_id, user_id, model, u["name"], True,
                               prompt_chars, sum(len(x) for x in acc_text),
                               int((time.time() - t0) * 1000), "")
                    return
            except UpstreamError as e:
                _mark_fail(u, idx, e.status, e.message)
                last_err = "%s#%d: %s" % (u["name"], idx, e.message)
                if started:
                    yield ("error", None, last_err)
                    return
                continue
            except Exception as e:
                _mark_fail(u, idx, 0, str(e))
                last_err = "%s#%d: %s" % (u["name"], idx, str(e)[:120])
                continue
    _log_usage(key_id, user_id, model, "-", False, prompt_chars, 0,
               int((time.time() - t0) * 1000), last_err[:180])
    yield ("fail", None, last_err)


async def _stream_gen(cands, model, messages, key_id, user_id, prompt_chars, t0):
    yield _sse_chunk(model, first=True)
    got_any = False
    fail_msg = ""
    async for kind, piece, err in _account_rotate(cands, model, messages, key_id, user_id, prompt_chars, t0):
        if kind == "piece":
            got_any = True
            yield _sse_chunk(model, piece=piece)
        elif kind == "error":
            fail_msg = err or "上游中断"
            break
        elif kind == "fail":
            fail_msg = err or "全部上游暂不可用"
            break
    if got_any:
        yield _sse_chunk(model, finish="stop")
        yield "data: [DONE]\n\n"
    else:
        yield "data: " + json.dumps(
            {"error": {"message": fail_msg or "全部上游暂不可用，请稍后再试", "type": "upstream_error"}},
            ensure_ascii=False) + "\n\n"


def _log_usage(key_id, user_id, model, upstream, ok, prompt_chars, comp_chars, latency_ms, err):
    try:
        with engine.connect() as conn:
            conn.execute(sql_text(
                "INSERT INTO ai_usage_log (key_id, user_id, model, upstream, ok, "
                "prompt_tokens, completion_tokens, latency_ms, err) "
                "VALUES (:k,:u,:m,:s,:o,:p,:c,:l,:e)"),
                {"k": key_id, "u": user_id, "m": model[:64], "s": upstream[:64], "o": ok,
                 "p": max(1, prompt_chars // 3), "c": max(1, comp_chars // 2),
                 "l": latency_ms, "e": (err or "")[:190]})
            if key_id and key_id > 0:
                conn.execute(sql_text(
                    "UPDATE ai_keys SET total_calls=total_calls+1, "
                    "total_tokens=total_tokens+:t, last_used_at=now(), "
                    "used_today = CASE WHEN usage_date=CURRENT_DATE THEN used_today+1 ELSE 1 END, "
                    "usage_date = CURRENT_DATE WHERE id=:k"),
                    {"t": max(1, prompt_chars // 3) + max(1, comp_chars // 2), "k": key_id})
            conn.commit()
    except Exception:
        pass


# ---------------------------------------------------------------- 管理端（X-Admin-Token）
def _require_admin(request: Request):
    if not ADMIN_TOKEN:
        raise HTTPException(503, detail={"message": "站长未配置 AI_GW_ADMIN_TOKEN"})
    if request.headers.get("x-admin-token", "") != ADMIN_TOKEN:
        raise HTTPException(401, detail={"message": "admin token 不对"})


def _mask(a):
    a = str(a)
    return a[:6] + "***" + a[-4:] if len(a) > 12 else a[:3] + "***"


class UpstreamIn(BaseModel):
    name: str = Field(..., max_length=64)
    kind: str = Field(..., max_length=24)
    base_url: str = Field(default="", max_length=300)
    accounts: list = Field(default_factory=list, max_length=50)
    models: list = Field(default_factory=list, max_length=50)
    enabled: bool = True


@router.get("/api/ai-gw/admin/upstreams")
def admin_list(request: Request, db: Session = Depends(get_db)):
    _require_admin(request)
    ensure_tables()
    rows = db.execute(sql_text(
        "SELECT id, name, kind, base_url, accounts, models, enabled, "
        "last_ok_at, last_err FROM ai_upstreams ORDER BY id")).mappings().all()
    out = []
    for r in rows:
        try:
            accs = r["accounts"] if isinstance(r["accounts"], list) else json.loads(r["accounts"] or "[]")
            mds = r["models"] if isinstance(r["models"], list) else json.loads(r["models"] or "[]")
        except Exception:
            accs, mds = [], []
        out.append({"id": r["id"], "name": r["name"], "kind": r["kind"], "base_url": r["base_url"],
                    "accounts": [_mask(a) for a in accs], "account_count": len(accs),
                    "models": mds, "enabled": r["enabled"],
                    "last_ok_at": str(r["last_ok_at"] or ""), "last_err": (r["last_err"] or "")[:120]})
    return {"upstreams": out}


@router.post("/api/ai-gw/admin/upstreams")
def admin_upsert(payload: UpstreamIn, request: Request, db: Session = Depends(get_db)):
    _require_admin(request)
    ensure_tables()
    if payload.kind not in ("openai", "doubao-web"):
        raise HTTPException(400, detail={"message": "kind 只能是 openai 或 doubao-web"})
    if payload.kind == "doubao-web":
        payload.base_url = ""
    accounts = [str(a).strip() for a in payload.accounts if str(a).strip()]
    models = [str(m).strip() for m in payload.models if str(m).strip()]
    if not accounts or not models:
        raise HTTPException(400, detail={"message": "accounts 和 models 都不能为空"})
    db.execute(sql_text(
        "INSERT INTO ai_upstreams (name, kind, base_url, accounts, models, enabled) "
        "VALUES (:n,:k,:b,CAST(:a AS jsonb),CAST(:m AS jsonb),:e) "
        "ON CONFLICT (name) DO UPDATE SET kind=:k, base_url=:b, accounts=CAST(:a AS jsonb), "
        "models=CAST(:m AS jsonb), enabled=:e, last_err=''"),
        {"n": payload.name.strip(), "k": payload.kind, "b": payload.base_url.rstrip("/"),
         "a": json.dumps(accounts), "m": json.dumps(models), "e": payload.enabled})
    db.commit()
    return {"ok": True, "accounts": len(accounts)}


@router.delete("/api/ai-gw/admin/upstreams/{uid}")
def admin_delete(uid: int, request: Request, db: Session = Depends(get_db)):
    _require_admin(request)
    ensure_tables()
    db.execute(sql_text("DELETE FROM ai_upstreams WHERE id=:i"), {"i": uid})
    db.commit()
    return {"ok": True}


@router.post("/api/ai-gw/admin/upstreams/{uid}/test")
async def admin_test(uid: int, request: Request, db: Session = Depends(get_db)):
    """逐个验号：doubao-web 用 account/info/v2，openai 用 GET /models。"""
    _require_admin(request)
    ensure_tables()
    row = db.execute(sql_text("SELECT * FROM ai_upstreams WHERE id=:i"), {"i": uid}).mappings().first()
    if not row:
        raise HTTPException(404, detail={"message": "上游不存在"})
    try:
        accs = row["accounts"] if isinstance(row["accounts"], list) else json.loads(row["accounts"] or "[]")
    except Exception:
        accs = []
    results = []
    async with httpx.AsyncClient(follow_redirects=True, timeout=20) as client:
        for i, a in enumerate(accs):
            alive, note = False, ""
            try:
                if row["kind"] == "doubao-web":
                    r = await client.post(
                        "https://www.doubao.com/passport/account/info/v2",
                        params={"account_sdk_source": "web"},
                        headers={"Cookie": _cookie_jar(a),
                                 "User-Agent": _DOUBAO_HEADERS["User-Agent"]})
                    try:
                        data = r.json()
                        alive = bool(data.get("data", data).get("user_id"))
                        note = "" if alive else "无 user_id"
                    except Exception:
                        note = "响应非 JSON"
                else:
                    r = await client.get("%s/models" % (row["base_url"] or "").rstrip("/"),
                                         headers={"Authorization": "Bearer %s" % a})
                    alive = r.status_code == 200
                    note = "" if alive else "http %d" % r.status_code
            except Exception as e:
                note = str(e)[:100]
            results.append({"idx": i, "account": _mask(a), "alive": alive, "note": note})
    return {"name": row["name"], "results": results,
            "alive": sum(1 for x in results if x["alive"]), "total": len(results)}
