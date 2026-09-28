"""
AI 分身路由 —— SSE 流式对话，多模型可插拔。

模型路由（全部来自 .env，密钥只在服务器）：
  doubao  → 本地 doubao-free-api（127.0.0.1:8000，sessionid）或豆包官方 Ark
  chatgpt → OpenAI 官方 / 任意 OpenAI 兼容服务
安全：
  前端只认 /api/ai/chat；上游只在本机回环或带官方鉴权；
  登录 40 条/h、未登录 6 条/h 限流；未配置的模型明确提示，不报 500。
"""
import json
import os
import time
import uuid

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from ..models.db_models import User
from ..ratelimit import limit
from ..services.auth_service import get_optional_user

router = APIRouter(prefix="/api/ai", tags=["AI分身"])

DEFAULT_PERSONA = (
    "你是「越」（网站 heyiwei.tech 的站长）的数字分身，说话自然、简短、有温度，像本人聊天，"
    "不用「作为AI」这类套话。你了解这个站：个人主页、AI 作物病害诊断（39 类叶片病害）、"
    "在线音乐（全网搜歌）、3D 云游校园、汴河图卷、博客与留言板。"
    "用户问技术、病害、站点功能都直接回答；不确定的事就直说不确定。"
    "回答尽量精简（默认 1-3 句），除非用户要求详细。"
)
AI_SYSTEM_PROMPT = (os.environ.get("AI_SYSTEM_PROMPT") or DEFAULT_PERSONA).strip()
AI_TIMEOUT = float(os.environ.get("AI_TIMEOUT") or "120")

AI_ROUTES = {
    "doubao": {
        "label": "豆包",
        "base": (os.environ.get("AI_DOUBAO_BASE") or "http://127.0.0.1:8000/v1").rstrip("/"),
        "key": (os.environ.get("AI_DOUBAO_KEY") or "").strip(),
        "model": (os.environ.get("AI_DOUBAO_MODEL") or "doubao").strip(),
    },
}

_SESSIONS: dict = {}
MAX_TURNS = 10
SESSION_TTL = 3600


def _gc_sessions():
    now = time.time()
    for sid in list(_SESSIONS.keys()):
        if now - _SESSIONS[sid]["ts"] > SESSION_TTL:
            _SESSIONS.pop(sid, None)


def _sse(data: dict) -> str:
    return "data: " + json.dumps(data, ensure_ascii=False) + "\n\n"


class ChatIn(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: str = Field(default="", max_length=64)
    context: str = Field(default="", max_length=500)
    model: str = Field(default="doubao", max_length=24)


@router.get("/status")
def ai_status():
    models = [
        {"id": k, "label": v["label"], "enabled": bool(v["base"] and v["key"]), "model": v["model"]}
        for k, v in AI_ROUTES.items()
    ]
    return {"enabled": any(m["enabled"] for m in models), "name": "越的分身", "models": models}


@router.post("/chat")
async def ai_chat(request: Request, payload: ChatIn, user: User = Depends(get_optional_user)):
    mid = payload.model if payload.model in AI_ROUTES else "doubao"
    cfg = AI_ROUTES[mid]
    if not (cfg["base"] and cfg["key"]):
        raise HTTPException(503, detail={
            "code": "MODEL_OFF",
            "message": f"「{cfg['label']}」还没接线：站长需要在服务器 .env 里配置 AI_{mid.upper()}_* 三项",
        })

    if user:
        limit(request, "ai_chat_u", 40, 3600, "今天的聊天额度用完啦，歇会儿再来～")
    else:
        limit(request, "ai_chat_g", 6, 3600, "登录后可以多聊几句哦")

    _gc_sessions()
    sid = payload.session_id or uuid.uuid4().hex[:16]
    sess = _SESSIONS.setdefault(sid, {"msgs": [], "ts": time.time()})
    sess["ts"] = time.time()

    msgs = [{"role": "system", "content": AI_SYSTEM_PROMPT}]
    if payload.context:
        msgs.append({"role": "system", "content": f"用户当前正在看：{payload.context}"})
    msgs.extend(sess["msgs"][-MAX_TURNS * 2:])
    msgs.append({"role": "user", "content": payload.message})

    headers = {"Content-Type": "application/json"}
    if cfg["key"]:
        headers["Authorization"] = f"Bearer {cfg['key']}"
    body = {"model": cfg["model"], "messages": msgs, "stream": True}

    async def gen():
        acc = []
        try:
            async with httpx.AsyncClient(timeout=AI_TIMEOUT) as client:
                async with client.stream("POST", f"{cfg['base']}/chat/completions",
                                         headers=headers, json=body) as r:
                    if r.status_code != 200:
                        yield _sse({"type": "error",
                                    "message": f"「{cfg['label']}」上游返回 {r.status_code}，可能 Key 失效或额度用完"})
                        return
                    async for line in r.aiter_lines():
                        if not line or not line.startswith("data:"):
                            continue
                        chunk = line[5:].strip()
                        if chunk == "[DONE]":
                            break
                        try:
                            j = json.loads(chunk)
                            delta = (j.get("choices") or [{}])[0].get("delta") or {}
                            piece = delta.get("content") or ""
                            if piece:
                                acc.append(piece)
                                yield _sse({"type": "delta", "text": piece})
                        except Exception:
                            continue
        except Exception as e:
            yield _sse({"type": "error", "message": "分身走神了：%s" % str(e)[:80]})
        finally:
            text = "".join(acc)
            if text:
                sess["msgs"].append({"role": "user", "content": payload.message})
                sess["msgs"].append({"role": "assistant", "content": text})
                sess["msgs"] = sess["msgs"][-MAX_TURNS * 2:]
            yield _sse({"type": "done", "session_id": sid})

    return StreamingResponse(
        gen(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-store", "X-Accel-Buffering": "no"},
    )


@router.post("/reset")
def ai_reset(payload: dict):
    sid = (payload or {}).get("session_id") or ""
    _SESSIONS.pop(sid, None)
    return {"ok": True}
