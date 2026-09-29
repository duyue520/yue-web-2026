"""
影视库后端 v5 —— 双源分工（视频流永不经过本站）

源能力（实测）：
  主源 无损云 wsyzy：suggest 搜索联想 + detail(ids) + 直链 m3u8(ACAO:* 可跨域原生播放)
  量子 lziapi（标准 macCMS）：分类过滤 t= 、关键词 wd= 、分页 pg= 、最新更新，全带封面

分工：
  * 浏览（首页分类行 / 分页列表）→ 量子源
  * 搜索 → 双源合并（量子 wd= + 主源 suggest）
  * 详情/播放 → 优先原源，失败自动跨源兜底；播放由访客浏览器直连 CDN
流量：仅 JSON 中转（KB 级）+ 10 分钟缓存；视频 0 流量。
"""
import time
import threading

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from sqlalchemy import text as sql_text
from sqlalchemy.orm import Session

from ..database import engine, get_db
from ..models.db_models import User
from ..services.auth_service import get_optional_user
from ..ratelimit import limit

router = APIRouter(prefix="/api/video", tags=["影视"])

SOURCES = {
    "主源": {"type": "suggest", "suggest": "https://wsyzy.cc/index.php/ajax/suggest",
             "detail": "https://api.wsyzy.net/api.php/provide/vod/", "referer": "https://wsyzy.cc/",
             "caps": {"browse": False, "search": "suggest"}},
    "量子": {"type": "mac", "detail": "https://cj.lziapi.com/api.php/provide/vod/",
             "referer": "https://cj.lziapi.com/",
             "caps": {"browse": True, "search": "wd"}},
}
DEFAULT_SRC = "主源"
BROWSE_SRC = "量子"
HOME_KEYWORDS = ["动作", "喜剧", "爱情", "科幻", "悬疑", "动漫"]   # 量子源 t= 过滤不可用，改用关键词驱动浏览

_cache = {}
_cache_lock = threading.Lock()
TTL = 600
MAX_CACHE = 800


def _cache_get(key):
    with _cache_lock:
        hit = _cache.get(key)
    if hit and time.time() - hit[0] < TTL:
        return hit[1]
    return None


def _cache_put(key, val):
    with _cache_lock:
        if len(_cache) > MAX_CACHE:
            _cache.clear()
        _cache[key] = (time.time(), val)


def _client(referer):
    return httpx.Client(timeout=15, follow_redirects=True,
                        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131 Safari/537.36",
                                 "Referer": referer})


def _parse_eps(play_url: str):
    if not play_url:
        return []
    out = []
    for seg in play_url.split("$$$")[0].split("#"):
        seg = seg.strip()
        if not seg:
            continue
        name, url = (seg.split("$", 1) if "$" in seg else ("", seg))
        if url.startswith("http"):
            out.append({"name": name or ("第%d集" % (len(out) + 1)), "url": url})
    return out


def _clean_kw(name: str) -> str:
    import re as _re
    s = _re.sub(r"[《》【】\[\]()（）:：·、,，!！?？'\"]", " ", name or "")
    s = _re.split(r"第[0-9一二三四五六七八九十]+[季集部]", s)[0]
    parts = [p for p in s.split() if len(p) >= 2]
    return (parts[0] if parts else (name or ""))[:20]


def _norm_items(rows, src_name, size=20):
    return [{"id": str(x.get("vod_id")), "name": x.get("vod_name") or "",
             "pic": x.get("vod_pic") or "", "remarks": x.get("vod_remarks") or "",
             "year": str(x.get("vod_year") or ""), "src": src_name}
            for x in rows[:size] if x.get("vod_id") and x.get("vod_name")]


def _classes(src_name):
    """分类表只在 ac=list 响应里返回（缓存 10 分钟）。"""
    ck = "cls:" + src_name
    cached = _cache_get(ck)
    if cached is not None:
        return cached
    cfg = SOURCES[src_name]
    out = []
    try:
        with _client(cfg["referer"]) as c:
            j = c.get(cfg["detail"], params={"ac": "list", "pg": 1}).json()
        out = [{"id": str(x.get("type_id")), "name": x.get("type_name") or ""} for x in (j.get("class") or [])]
    except Exception:
        out = []
    _cache_put(ck, out)
    return out


def _mac_fetch(src_name, params, size=20):
    cfg = SOURCES[src_name]
    with _client(cfg["referer"]) as c:
        r = c.get(cfg["detail"], params=params)
        j = r.json()
    return _norm_items(j.get("list") or [], src_name, size), (j.get("class") or [])


@router.get("/suggest")
def suggest(request: Request, kw: str):
    limit(request, "video_sug", 90, 60, "太快了")
    kw = (kw or "").strip()[:30]
    if not kw:
        return {"list": []}
    ck = "g1:" + kw
    cached = _cache_get(ck)
    if cached is not None:
        return cached
    out = []
    try:
        cfg = SOURCES[DEFAULT_SRC]
        with _client(cfg["referer"]) as c:
            r = c.get(cfg["suggest"], params={"mid": 1, "wd": kw})
            for x in (r.json().get("list") or [])[:8]:
                if x.get("name"):
                    out.append({"name": x["name"]})
    except Exception:
        pass
    data = {"list": out}
    _cache_put(ck, data)
    return data


@router.get("/home")
def home(request: Request):
    limit(request, "video_home", 40, 60, "太快啦")
    ck = "home:v5"
    cached = _cache_get(ck)
    if cached is not None:
        return cached
    rows = []
    try:
        latest, _ = _mac_fetch(BROWSE_SRC, {"ac": "detail", "pg": 1}, 18)
        if latest:
            rows.append({"name": "🔥 最新更新", "kw": "", "items": latest})
    except Exception:
        pass
    for kw in HOME_KEYWORDS:
        try:
            items, _ = _mac_fetch(BROWSE_SRC, {"ac": "detail", "wd": kw, "pg": 1}, 14)
            if items:
                rows.append({"name": kw, "kw": kw, "items": items})
        except Exception:
            continue
    if not rows:
        raise HTTPException(502, detail={"message": "片源首页繁忙，稍后再试"})
    data = {"src": BROWSE_SRC,
            "homeTypes": [{"id": k, "name": k} for k in HOME_KEYWORDS],
            "allTypes": _classes(BROWSE_SRC)[:40],
            "rows": rows}
    _cache_put(ck, data)
    return data


@router.get("/list")
def vlist(request: Request, kw: str = "", page: int = 1, size: int = 24):
    """关键词驱动的分类列表（量子源 t= 过滤不可用，统一走 wd= 搜索分页）。"""
    limit(request, "video_list", 60, 60, "太快啦")
    page = max(1, min(int(page or 1), 200))
    size = max(6, min(int(size or 24), 40))
    kkw = (kw or "").strip()[:20]
    ck = "l3:%s:%d:%d" % (kkw, page, size)
    cached = _cache_get(ck)
    if cached is not None:
        return cached
    params = {"ac": "detail", "pg": page}
    if kkw:
        params["wd"] = kkw
    try:
        items, _ = _mac_fetch(BROWSE_SRC, params, size)
    except Exception:
        raise HTTPException(502, detail={"message": "列表加载失败，稍后再试"})
    data = {"src": BROWSE_SRC, "kw": kkw, "page": page, "items": items, "hasMore": len(items) >= size}
    _cache_put(ck, data)
    return data


def _search_one(src_name, kw):
    cfg = SOURCES[src_name]
    if cfg["caps"]["search"] == "suggest":
        with _client(cfg["referer"]) as c:
            rows = c.get(cfg["suggest"], params={"mid": 1, "wd": kw}).json().get("list") or []
        return [{"id": str(x["id"]), "name": x.get("name") or "", "pic": x.get("pic") or "",
                 "remarks": "", "year": "", "src": src_name} for x in rows[:30] if x.get("id") and x.get("name")]
    items, _ = _mac_fetch(src_name, {"ac": "detail", "wd": kw, "pg": 1}, 30)
    return items


@router.get("/search")
def search(request: Request, kw: str, src: str = "all"):
    limit(request, "video_search", 30, 60, "搜太快啦，歇一秒再搜～")
    kw = (kw or "").strip()[:40]
    if not kw:
        raise HTTPException(400, detail={"message": "请输入片名"})
    names = list(SOURCES.keys()) if src in ("", "all", None) else [src]
    names = [n for n in names if n in SOURCES]
    ck = "s3:%s:%s" % (",".join(names), kw)
    cached = _cache_get(ck)
    if cached is not None:
        return cached
    items, seen, ok = [], set(), []
    for n in names:
        try:
            for it in _search_one(n, kw):
                k = it["name"].strip()
                if k in seen:
                    continue
                seen.add(k)
                items.append(it)
            ok.append(n)
        except Exception:
            continue
    if not items and not ok:
        raise HTTPException(502, detail={"message": "片源搜索服务繁忙，稍后再试"})
    data = {"kw": kw, "total": len(items), "list": items[:40], "sources": list(SOURCES.keys())}
    _cache_put(ck, data)
    return data


def _fetch_detail(cfg, vid):
    with _client(cfg["referer"]) as c:
        r = c.get(cfg["detail"], params={"ac": "detail", "ids": vid})
        return r.json().get("list") or []


@router.get("/detail")
def detail(request: Request, id: str, src: str = DEFAULT_SRC, fallback: int = 1):
    limit(request, "video_detail", 40, 60, "点太快啦，歇一秒～")
    vid = "".join(ch for ch in (id or "") if ch.isdigit())[:12]
    if not vid:
        raise HTTPException(400, detail={"message": "id 不合法"})
    src_name = src if src in SOURCES else DEFAULT_SRC
    ck = "d4:%s:%s:%d" % (src_name, vid, fallback)
    cached = _cache_get(ck)
    if cached is not None:
        return cached
    tried, lst, used_src = [], [], src_name
    try:
        lst = _fetch_detail(SOURCES[src_name], vid)
        tried.append(src_name)
    except Exception:
        tried.append(src_name + "(失败)")
    if fallback and ((not lst) or (not _parse_eps(lst[0].get("vod_play_url") or ""))):
        want = _clean_kw(lst[0].get("vod_name") if lst else "")
        for alt in [n for n in SOURCES if n != src_name]:
            try:
                cand = _search_one(alt, want) if want else []
                if not cand:
                    continue
                alst = _fetch_detail(SOURCES[alt], cand[0]["id"])
                if alst and _parse_eps(alst[0].get("vod_play_url") or ""):
                    lst, used_src = alst, alt
                    tried.append(alt + "(兜底成功)")
                    break
                tried.append(alt + "(无剧集)")
            except Exception:
                tried.append(alt + "(失败)")
                continue
    if not lst:
        raise HTTPException(404, detail={"message": "各线路都没有这部片子，换个片名试试"})
    v = lst[0]
    data = {"id": vid, "src": used_src, "tried": tried, "recovered": used_src != src_name,
            "name": v.get("vod_name") or "", "pic": v.get("vod_pic") or "",
            "year": v.get("vod_year") or "", "type": v.get("type_name") or "",
            "area": v.get("vod_area") or "", "remarks": v.get("vod_remarks") or "",
            "actor": v.get("vod_actor") or "", "director": v.get("vod_director") or "",
            "content": (v.get("vod_content") or "").strip()[:300],
            "eps": _parse_eps(v.get("vod_play_url") or "")}
    _cache_put(ck, data)
    return data


# ---------------- 账号同步（收藏 / 观看进度）：两张小表、节流写入 ----------------
MAX_FAVS = 200
MAX_PROG = 300
_tables_ready = False


def _ensure_tables():
    global _tables_ready
    if _tables_ready:
        return
    with engine.connect() as conn:
        conn.execute(sql_text("""
            CREATE TABLE IF NOT EXISTS video_favs (
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                name VARCHAR(120) NOT NULL,
                src VARCHAR(24) NOT NULL DEFAULT '',
                vod_id VARCHAR(24) NOT NULL DEFAULT '',
                pic VARCHAR(500) NOT NULL DEFAULT '',
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                PRIMARY KEY (user_id, name)
            )"""))
        conn.execute(sql_text("""
            CREATE TABLE IF NOT EXISTS video_prog (
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                name VARCHAR(120) NOT NULL,
                src VARCHAR(24) NOT NULL DEFAULT '',
                vod_id VARCHAR(24) NOT NULL DEFAULT '',
                pic VARCHAR(500) NOT NULL DEFAULT '',
                ep INTEGER NOT NULL DEFAULT 0,
                pos INTEGER NOT NULL DEFAULT 0,
                updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                PRIMARY KEY (user_id, name)
            )"""))
        conn.commit()
    _tables_ready = True


class FavIn(BaseModel):
    name: str = Field(..., max_length=120)
    src: str = Field("", max_length=24)
    vod_id: str = Field("", max_length=24)
    pic: str = Field("", max_length=500)
    on: bool = True


class ProgIn(BaseModel):
    name: str = Field(..., max_length=120)
    src: str = Field("", max_length=24)
    vod_id: str = Field("", max_length=24)
    pic: str = Field("", max_length=500)
    ep: int = Field(0, ge=0, le=5000)
    pos: int = Field(0, ge=0, le=100000)


@router.get("/sync")
def sync(request: Request, user: User = Depends(get_optional_user), db: Session = Depends(get_db)):
    """拉取本账号的收藏与观看进度（未登录返回 logged_in=false，前端用本地缓存）。"""
    limit(request, "video_sync", 60, 60, "太快啦")
    if not user:
        return {"logged_in": False, "favs": [], "prog": {}}
    _ensure_tables()
    favs = db.execute(sql_text(
        "SELECT name, src, vod_id, pic FROM video_favs WHERE user_id=:u ORDER BY created_at DESC"),
        {"u": user.id}).mappings().all()
    progs = db.execute(sql_text(
        "SELECT name, src, vod_id, pic, ep, pos FROM video_prog WHERE user_id=:u ORDER BY updated_at DESC LIMIT 60"),
        {"u": user.id}).mappings().all()
    return {"logged_in": True,
            "favs": [dict(f) for f in favs],
            "prog": {p["name"]: {"src": p["src"], "id": p["vod_id"], "pic": p["pic"], "ep": p["ep"], "t": p["pos"]} for p in progs}}


@router.post("/fav")
def fav(payload: FavIn, request: Request, user: User = Depends(get_optional_user), db: Session = Depends(get_db)):
    """收藏 / 取消收藏（同一部片名唯一）。"""
    limit(request, "video_fav", 90, 60, "太快啦")
    if not user:
        raise HTTPException(401, detail={"message": "登录后收藏才能跨设备同步"})
    _ensure_tables()
    if payload.on:
        db.execute(sql_text("""
            INSERT INTO video_favs (user_id, name, src, vod_id, pic)
            VALUES (:u, :n, :s, :i, :p)
            ON CONFLICT (user_id, name) DO UPDATE SET src=:s, vod_id=:i, pic=:p"""),
            {"u": user.id, "n": payload.name[:120], "s": payload.src[:24],
             "i": payload.vod_id[:24], "p": payload.pic[:500]})
        db.execute(sql_text("""
            DELETE FROM video_favs WHERE user_id=:u AND name IN (
                SELECT name FROM video_favs WHERE user_id=:u ORDER BY created_at DESC OFFSET :cap)"""),
            {"u": user.id, "cap": MAX_FAVS})
    else:
        db.execute(sql_text("DELETE FROM video_favs WHERE user_id=:u AND name=:n"),
                   {"u": user.id, "n": payload.name[:120]})
    db.commit()
    return {"ok": True}


@router.post("/prog")
def prog(payload: ProgIn, request: Request, user: User = Depends(get_optional_user), db: Session = Depends(get_db)):
    """上报观看进度（前端 10 秒节流，单行 upsert，极轻）。"""
    limit(request, "video_prog", 120, 60, "太快啦")
    if not user:
        return {"ok": True, "skipped": "guest"}
    _ensure_tables()
    db.execute(sql_text("""
        INSERT INTO video_prog (user_id, name, src, vod_id, pic, ep, pos, updated_at)
        VALUES (:u, :n, :s, :i, :p, :e, :t, now())
        ON CONFLICT (user_id, name) DO UPDATE
        SET src=:s, vod_id=:i, pic=:p, ep=:e, pos=:t, updated_at=now()"""),
        {"u": user.id, "n": payload.name[:120], "s": payload.src[:24], "i": payload.vod_id[:24],
         "p": payload.pic[:500], "e": payload.ep, "t": payload.pos})
    db.execute(sql_text("""
        DELETE FROM video_prog WHERE user_id=:u AND name IN (
            SELECT name FROM video_prog WHERE user_id=:u ORDER BY updated_at DESC OFFSET :cap)"""),
        {"u": user.id, "cap": MAX_PROG})
    db.commit()
    return {"ok": True}


@router.get("/health")
def health():
    return {"ok": True, "cache": len(_cache), "sources": list(SOURCES.keys()), "browse": BROWSE_SRC}
