"""
影视搜索/详情代理 v2 —— 多采集源（只转发 KB 级 JSON，10 分钟缓存 + 限流）。

流量原则（站长服务器没买流量包）：
  * 视频流不经过本服务：详情接口把 m3u8 直链返给浏览器，由访客直连第三方 CDN
    （实测主源 CDN 返回 ACAO:*，可跨域；播放器用 hls.js 选最高清晰度档）。
  * 本服务只中转搜索/详情 JSON（每次几 KB）。
数据源：公开苹果CMS 采集接口，仅供个人学习检索，本站不存储任何视频。
"""
import time
import threading

import httpx
from fastapi import APIRouter, HTTPException, Request

from ..ratelimit import limit

router = APIRouter(prefix="/api/video", tags=["影视"])

# 源定义：type=suggest（无损云 suggest + detail） | mac（标准苹果CMS detail 接口）
SOURCES = {
    "主源": {"type": "suggest", "suggest": "https://wsyzy.cc/index.php/ajax/suggest",
             "detail": "https://api.wsyzy.net/api.php/provide/vod/", "referer": "https://wsyzy.cc/"},
    "量子": {"type": "mac", "detail": "https://cj.lziapi.com/api.php/provide/vod/",
             "referer": "https://cj.lziapi.com/"},
}
DEFAULT_SRC = "主源"

_cache = {}
_cache_lock = threading.Lock()
TTL = 600
MAX_CACHE = 600


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
    """苹果CMS vod_play_url: '第1集$http://a.m3u8#第2集$http://b.m3u8$$$备用线路…'"""
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


def _search_one(src_name, cfg, kw):
    with _client(cfg["referer"]) as c:
        if cfg["type"] == "suggest":
            r = c.get(cfg["suggest"], params={"mid": 1, "wd": kw})
            rows = r.json().get("list") or []
            return [{"id": str(x["id"]), "name": x.get("name") or "", "pic": x.get("pic") or "",
                     "src": src_name} for x in rows[:30] if x.get("id") and x.get("name")]
        r = c.get(cfg["detail"], params={"ac": "detail", "wd": kw})
        rows = r.json().get("list") or []
        return [{"id": str(x.get("vod_id")), "name": x.get("vod_name") or "", "pic": x.get("vod_pic") or "",
                 "src": src_name} for x in rows[:30] if x.get("vod_id") and x.get("vod_name")]


@router.get("/search")
def search(request: Request, kw: str, src: str = "all"):
    limit(request, "video_search", 30, 60, "搜太快啦，歇一秒再搜～")
    kw = (kw or "").strip()[:40]
    if not kw:
        raise HTTPException(400, detail={"message": "请输入片名"})
    names = list(SOURCES.keys()) if src in ("", "all", None) else [src]
    names = [n for n in names if n in SOURCES]
    ck = "s2:%s:%s" % (",".join(names), kw)
    cached = _cache_get(ck)
    if cached is not None:
        return cached
    items, seen, ok_src = [], set(), []
    for n in names:
        try:
            got = _search_one(n, SOURCES[n], kw)
            ok_src.append(n)
            for it in got:
                key = it["name"].strip()
                if key in seen:
                    continue
                seen.add(key)
                items.append(it)
        except Exception:
            continue
    if not items and not ok_src:
        raise HTTPException(502, detail={"message": "片源服务繁忙，稍后再试"})
    data = {"kw": kw, "total": len(items), "list": items[:40], "sources": list(SOURCES.keys())}
    _cache_put(ck, data)
    return data


@router.get("/detail")
def detail(request: Request, id: str, src: str = DEFAULT_SRC):
    limit(request, "video_detail", 40, 60, "点太快啦，歇一秒～")
    vid = "".join(ch for ch in (id or "") if ch.isdigit())[:12]
    if not vid:
        raise HTTPException(400, detail={"message": "id 不合法"})
    src_name = src if src in SOURCES else DEFAULT_SRC
    cfg = SOURCES[src_name]
    ck = "d2:%s:%s" % (src_name, vid)
    cached = _cache_get(ck)
    if cached is not None:
        return cached
    try:
        with _client(cfg["referer"]) as c:
            r = c.get(cfg["detail"], params={"ac": "detail", "ids": vid})
            lst = r.json().get("list") or []
    except Exception:
        raise HTTPException(502, detail={"message": "片源详情繁忙，稍后再试"})
    if not lst:
        raise HTTPException(404, detail={"message": "没找到这部片子"})
    v = lst[0]
    data = {
        "id": vid, "src": src_name,
        "name": v.get("vod_name") or "", "pic": v.get("vod_pic") or "",
        "year": v.get("vod_year") or "", "type": v.get("type_name") or "",
        "area": v.get("vod_area") or "", "remarks": v.get("vod_remarks") or "",
        "actor": v.get("vod_actor") or "", "director": v.get("vod_director") or "",
        "content": (v.get("vod_content") or "").strip()[:300],
        "eps": _parse_eps(v.get("vod_play_url") or ""),
    }
    _cache_put(ck, data)
    return data


@router.get("/health")
def health():
    return {"ok": True, "cache": len(_cache), "sources": list(SOURCES.keys())}
