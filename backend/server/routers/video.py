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

import concurrent.futures as _cf
import re

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
    "暴风": {"type": "mac", "detail": "https://bfzyapi.com/api.php/provide/vod/",
             "referer": "https://bfzyapi.com/",
             "caps": {"browse": False, "search": "wd"}},
}
DEFAULT_SRC = "主源"
BROWSE_SRC = "量子"
HOME_KEYWORDS = ["电影", "电视剧", "动漫", "综艺", "动作", "喜剧"]   # 量子源 t= 过滤不可用，改用关键词驱动浏览

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


def _norm_title(s: str) -> str:
    """片名归一化：去标点/空格/季集标记，用于严格同名判定。"""
    import re as _re
    t = (s or "").strip().lower()
    t = _re.sub(r"[《》【】\[\]()（）:：·、,，。.!！?？'\"“”‘’\-—_\s]+", "", t)
    t = _re.sub(r"(第[0-9一二三四五六七八九十]+[季部集])$", "", t)
    return t


def _strict_same(a: str, b: str) -> bool:
    """严格同名：归一化后完全相等，才允许自动换源/兜底，防止放错片。"""
    na, nb = _norm_title(a), _norm_title(b)
    return bool(na) and na == nb


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
    # 并行拉行（原来串行 7 次远端请求 → 现在并发，首屏 ~8s 降到 ~1.5s）
    jobs = [("", {"ac": "detail", "pg": 1}, 18)] + [(k, {"ac": "detail", "wd": k, "pg": 1}, 14) for k in HOME_KEYWORDS]
    with _cf.ThreadPoolExecutor(max_workers=7) as ex:
        futs = []
        for kw, params, size in jobs:
            label = "🔥 最新更新" if not kw else kw
            futs.append((label, kw, ex.submit(_mac_fetch, BROWSE_SRC, params, size)))
        for label, kw, fut in futs:
            try:
                items, _ = fut.result(timeout=12)
                if items:
                    rows.append({"name": label, "kw": kw, "items": items})
            except Exception:
                continue
    rows.sort(key=lambda r: 0 if not r["kw"] else 1)
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
    # 多源并行搜索（原来串行，源多后成倍变慢）
    with _cf.ThreadPoolExecutor(max_workers=4) as ex:
        futs = [(n, ex.submit(_search_one, n, kw)) for n in names]
        for n, fut in futs:
            try:
                for it in fut.result(timeout=15):
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


def _probe_res(url: str) -> str:
    """探测 m3u8 最高分辨率（只读前 ~32KB，短超时；失败返回空）。仅用于详情页标注画质。"""
    if not url or ".m3u8" not in url:
        return ""
    try:
        import re as _re
        with httpx.Client(timeout=6, follow_redirects=True,
                          headers={"User-Agent": "Mozilla/5.0 Chrome/131"}) as c:
            with c.stream("GET", url) as r:
                if r.status_code != 200:
                    return ""
                buf = ""
                for chunk in r.iter_text():
                    buf += chunk
                    if len(buf) > 32768 or "EXT-X-ENDLIST" in buf:
                        break
        res = sorted({int(x) for x in _re.findall(r"RESOLUTION=\d+x(\d+)", buf)}, reverse=True)
        if res:
            return "%dP" % res[0]
        bw = sorted({int(x) for x in _re.findall(r"BANDWIDTH=(\d+)", buf)}, reverse=True)
        if bw:
            return "%.1fM" % (bw[0] / 1000000.0)
        return "SD" if buf.startswith("#EXTM3U") else ""
    except Exception:
        return ""


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
            want_full = (lst[0].get("vod_name") if lst else "") or ""
            want = _clean_kw(want_full)
            for alt in [n for n in SOURCES if n != src_name]:
                try:
                    cand = _search_one(alt, want) if want else []
                    hit = None
                    for c0 in cand[:8]:
                        # 只接受「严格同名」的候选，避免兜底换成别的片子
                        if _strict_same(c0.get("name") or "", want_full):
                            hit = c0
                            break
                    if not hit:
                        tried.append(alt + "(无同名)")
                        continue
                    alst = _fetch_detail(SOURCES[alt], hit["id"])
                    if alst and _parse_eps(alst[0].get("vod_play_url") or ""):
                        lst, used_src = alst, alt
                        tried.append(alt + "(同名兜底成功)")
                        break
                    tried.append(alt + "(同名无剧集)")
                except Exception:
                    tried.append(alt + "(失败)")
                    continue
    if not lst:
        raise HTTPException(404, detail={"message": "各线路都没有这部片子，换个片名试试"})
    v = lst[0]
    eps = _parse_eps(v.get("vod_play_url") or "")
    data = {"id": vid, "src": used_src, "tried": tried, "recovered": used_src != src_name,
            "name": v.get("vod_name") or "", "pic": v.get("vod_pic") or "",
            "year": v.get("vod_year") or "", "type": v.get("type_name") or "",
            "area": v.get("vod_area") or "", "remarks": v.get("vod_remarks") or "",
            "actor": v.get("vod_actor") or "", "director": v.get("vod_director") or "",
            "content": (v.get("vod_content") or "").strip()[:300],
            "eps": eps}
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


@router.get("/extra")
def extra(request: Request, id: str, src: str = DEFAULT_SRC, name: str = ""):
    """详情页异步补充：首集画质 + 同名其它线路候选（并行，不阻塞首屏）。"""
    limit(request, "video_extra", 60, 60, "太快啦")
    vid = "".join(ch for ch in (id or "") if ch.isdigit())[:12]
    if not vid:
        raise HTTPException(400, detail={"message": "id 不合法"})
    src_name = src if src in SOURCES else DEFAULT_SRC
    want = _clean_kw(name or "")
    ck = "x1:%s:%s:%s" % (src_name, vid, want)
    cached = _cache_get(ck)
    if cached is not None:
        return cached

    def job_res():
        try:
            lst = _fetch_detail(SOURCES[src_name], vid)
            eps = _parse_eps(lst[0].get("vod_play_url") or "") if lst else []
            return _probe_res(eps[0]["url"]) if eps else ""
        except Exception:
            return ""

    def job_alts():
        out = []
        if not want:
            return out
        for alt in [n for n in SOURCES if n != src_name]:
            try:
                cand = _search_one(alt, want)
                for c0 in cand[:5]:
                    cname = c0.get("name") or ""
                    if want not in cname and cname not in want and _clean_kw(cname) != want:
                        continue
                    alst = _fetch_detail(SOURCES[alt], c0["id"])
                    aeps = _parse_eps(alst[0].get("vod_play_url") or "") if alst else []
                    if not aeps:
                        continue
                    aname = alst[0].get("vod_name") or cname
                    out.append({"src": alt, "id": c0["id"], "name": aname,
                                "strict": _strict_same(aname, name or aname),
                                "pic": alst[0].get("vod_pic") or c0.get("pic") or "",
                                "epCount": len(aeps), "maxRes": _probe_res(aeps[0]["url"]),
                                "remarks": alst[0].get("vod_remarks") or ""})
                    break
            except Exception:
                continue
        return out[:3]

    with _cf.ThreadPoolExecutor(max_workers=2) as ex:
        f1, f2 = ex.submit(job_res), ex.submit(job_alts)
        max_res, alts = f1.result(timeout=12), f2.result(timeout=15)

    def _q(v):
        d = "".join(ch for ch in (v or "") if ch.isdigit())
        return int(d) if d else 0

    # 严格同名优先，其次按画质；best 只在严格同名里选（防止自动切换放错片）
    alts.sort(key=lambda a: (0 if a.get("strict") else 1, -_q(a.get("maxRes"))))
    best_marked = False
    for a in alts:
        if a.get("strict") and not best_marked and _q(a.get("maxRes")) > _q(max_res):
            a["best"] = True
            best_marked = True
        else:
            a["best"] = False
    data = {"maxRes": max_res, "maxResRank": _q(max_res), "expectName": name or "",
            "alts": alts, "strictAltCount": sum(1 for a in alts if a.get("strict"))}
    _cache_put(ck, data)
    return data


# ---------------- 缓存预热：后台线程每 8 分钟静默刷新首页（访客永远秒开） ----------------
_warm_started = False


def _warm_once():
    try:
        with _cf.ThreadPoolExecutor(max_workers=7) as ex:
            jobs = [("", {"ac": "detail", "pg": 1}, 18)] + [(k, {"ac": "detail", "wd": k, "pg": 1}, 14) for k in HOME_KEYWORDS]
            futs = []
            for kw, params, size in jobs:
                label = "🔥 最新更新" if not kw else kw
                futs.append((label, kw, ex.submit(_mac_fetch, BROWSE_SRC, params, size)))
            rows = []
            for label, kw, fut in futs:
                try:
                    items, _ = fut.result(timeout=12)
                    if items:
                        rows.append({"name": label, "kw": kw, "items": items})
                except Exception:
                    continue
        if rows:
            rows.sort(key=lambda r: 0 if not r["kw"] else 1)
            _cache_put("home:v5", {"src": BROWSE_SRC,
                                   "homeTypes": [{"id": k, "name": k} for k in HOME_KEYWORDS],
                                   "allTypes": _classes(BROWSE_SRC)[:40], "rows": rows})
    except Exception:
        pass


def _warm_loop():
    import time as _t
    while True:
        _warm_once()
        _t.sleep(480)


def start_warmer():
    """由 main.py 启动时调用；线程托管在应用进程内，单线程 + 8 分钟一次，开销可忽略。"""
    global _warm_started
    if _warm_started:
        return
    _warm_started = True
    import threading as _th
    t = _th.Thread(target=_warm_loop, name="video-cache-warmer", daemon=True)
    t.start()


# ---------------- 平台直搜（爱奇艺/优酷/B站）→ 交给解析线路播放，用户无需贴链接 ----------------
def _search_iqiyi(kw):
    with _client("https://www.iqiyi.com/") as c:
        r = c.get("https://search.video.iqiyi.com/o", params={"if": "html5", "key": kw})
        data = r.json().get("data") or {}
    out = []
    for d in (data.get("docinfos") or [])[:12]:
        t = (d.get("title") or "").replace("<em>", "").replace("</em>", "").strip()
        if not t:
            continue
        vid = d.get("videoId") or ""
        aid = d.get("albumId") or (d.get("albumDocInfo") or {}).get("albumId") or ""
        url = ("https://www.iqiyi.com/v_%s.html" % vid) if vid else ("https://www.iqiyi.com/a_%s.html" % aid if aid else "")
        if not url:
            continue
        out.append({"platform": "爱奇艺", "name": t, "pic": d.get("imageUrl") or d.get("albumImageUrl") or "",
                    "url": url, "note": (d.get("albumDocInfo") or {}).get("channel") or ""})
    return out


def _search_youku(kw):
    with _client("https://www.youku.com/") as c:
        r = c.get("https://search.youku.com/api/search", params={"keyword": kw})
        j = r.json()
    items = (((j.get("pageData") or {}).get("componentList")) or [])
    out = []
    for it in items:
        if it.get("templateType") not in ("video", "ogc", "youku", None):
            pass
        vid = it.get("videoId") or it.get("id") or ""
        t = (it.get("title") or "").strip()
        if not vid or not t:
            continue
        out.append({"platform": "优酷", "name": t,
                    "pic": it.get("poster") or it.get("img") or "",
                    "url": "https://v.youku.com/v_show/id_%s.html" % vid, "note": it.get("subTitle") or ""})
        if len(out) >= 12:
            break
    return out


def _search_bilibili(kw):
    try:
        h = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131 Safari/537.36",
             "Referer": "https://www.bilibili.com/", "Origin": "https://www.bilibili.com",
             "Cookie": "buvid3=%s-1infoc" % __import__("uuid").uuid4().hex[:16]}
        with httpx.Client(timeout=12, follow_redirects=True, headers=h) as c:
            r = c.get("https://api.bilibili.com/x/web-interface/search/type",
                      params={"search_type": "video", "keyword": kw})
            j = r.json()
        res = ((j.get("data") or {}).get("result")) or []
        out = []
        for x in res[:12]:
            bv = x.get("bvid") or ""
            if not bv:
                continue
            t = re.sub(r"<[^>]+>", "", x.get("title") or "").strip()
            pic = x.get("pic") or ""
            if pic.startswith("//"):
                pic = "https:" + pic
            out.append({"platform": "B站", "name": t, "pic": pic,
                        "url": "https://www.bilibili.com/video/%s" % bv, "note": x.get("author") or ""})
        return out
    except Exception:
        return []


@router.get("/platform")
def platform(request: Request, kw: str):
    """平台聚合搜索：返回各平台视频页链接（前端交给解析线路直接播放，无需用户贴链接）。"""
    limit(request, "video_platform", 30, 60, "太快啦")
    kw = (kw or "").strip()[:40]
    if not kw:
        raise HTTPException(400, detail={"message": "请输入片名"})
    ck = "pf1:" + kw
    cached = _cache_get(ck)
    if cached is not None:
        return cached
    res, ok_pf = [], []
    with _cf.ThreadPoolExecutor(max_workers=3) as ex:
        futs = [("爱奇艺", ex.submit(_search_iqiyi, kw)), ("优酷", ex.submit(_search_youku, kw)),
                ("B站", ex.submit(_search_bilibili, kw))]
        for name, fut in futs:
            try:
                got = fut.result(timeout=14)
                if got:
                    ok_pf.append(name)
                    res.extend(got)
            except Exception:
                continue
    data = {"kw": kw, "total": len(res), "platforms": ok_pf, "list": res[:30]}
    _cache_put(ck, data)
    return data


@router.get("/health")
def health():
    return {"ok": True, "cache": len(_cache), "sources": list(SOURCES.keys()), "browse": BROWSE_SRC}
