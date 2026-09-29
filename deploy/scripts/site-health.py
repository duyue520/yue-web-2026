#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""全站全面体检：接口 + 静态资源 + 服务状态 + 近期错误日志"""
import json
import subprocess
import urllib.parse

R = "https://heyiwei.tech"
ok, warn, bad = [], [], []


def curl(path, extra=None, timeout=40):
    cmd = ["curl", "-sk", "-m", str(timeout), "--resolve", "heyiwei.tech:443:127.0.0.1"]
    if extra:
        cmd += extra
    cmd.append(R + path)
    out = subprocess.run(cmd, capture_output=True)
    return out.returncode, out.stdout.decode("utf-8", "replace")


def j(path, timeout=40):
    rc, body = curl(path, timeout=timeout)
    try:
        return json.loads(body)
    except Exception:
        return {"_raw": body[:120]}


def check(label, cond, detail="", level="ok"):
    (ok if cond else (bad if level == "bad" else warn)).append(label)
    print("[%s] %-34s %s" % ("PASS" if cond else ("FAIL" if level == "bad" else "WARN"), label, detail))


print("=" * 74)
print("一、接口层")
print("=" * 74)
h = j("/api/video/home")
check("影视-首页", bool(h.get("rows")), "行数=%d 分类=%d" % (len(h.get("rows") or []), len(h.get("homeTypes") or [])), "bad")
q = urllib.parse.quote
check("影视-联想", bool((j("/api/video/suggest?kw=" + q("斗罗")).get("list"))), "", "bad")
check("影视-列表", bool((j("/api/video/list?kw=" + q("电影") + "&page=1").get("items"))), "", "bad")
s = j("/api/video/search?kw=" + q("狂飙"))
check("影视-搜索", len(s.get("list") or []) > 3, "%d 条" % len(s.get("list") or []), "bad")
if s.get("list"):
    it = s["list"][0]
    d = j("/api/video/detail?id=%s&src=%s&fallback=1" % (it["id"], q(it.get("src") or "主源")))
    check("影视-详情", bool(d.get("eps")), "%s %d集" % ((d.get("name") or "-")[:12], len(d.get("eps") or [])), "bad")
    ex = j("/api/video/extra?id=%s&src=%s&name=%s" % (it["id"], q(it.get("src") or "主源"), q(d.get("name") or "")), 60)
    check("影视-异步补充", "maxRes" in ex, "画质=%s 备选=%d" % (ex.get("maxRes") or "?", len(ex.get("alts") or [])), "warn")
check("影视-游客同步降级", j("/api/video/sync").get("logged_in") is False, "", "bad")
b = j("/api/blog/articles?limit=5")
check("博客-列表", b.get("total", 0) >= 1, "%d 篇 作者=%s" % (b.get("total", 0), ((b.get("articles") or [{}])[0].get("author") or "-")), "bad")
if b.get("articles"):
    aid = b["articles"][0]["id"]
    check("博客-详情", bool(j("/api/blog/articles/%d" % aid).get("content")), "", "bad")
check("健康检查", j("/api/health").get("status") == "ok", "", "bad")
check("分身状态", bool(j("/api/ai/status").get("models")), "模型=%s" % [m.get("id") for m in (j("/api/ai/status").get("models") or [])], "bad")
rc, tok = curl("/api/auth/login", ["-X", "POST", "-H", "Content-Type: application/json",
                                   "-d", '{"username":"__probe__","password":"x"}'])
check("登录接口(错误口令)", rc in (0, 22), "返回需为 401/400 而非 500", "warn")

print()
print("=" * 74)
print("二、静态资源与前端产物")
print("=" * 74)
rc, idx = curl("/")
check("首页 HTML", rc == 0 and "<div id=\"app\">" in idx, "%d 字节" % len(idx), "bad")
check("no-referrer 已注入", "no-referrer" in idx, "", "warn")
import re
mainf = re.search(r"index-[A-Za-z0-9_-]+\.js", idx)
if mainf:
    rc2, main = curl("/assets/" + mainf.group(0))
    check("主分块可加载", rc2 == 0 and len(main) > 100000, mainf.group(0), "bad")
    vpf = re.search(r"VideoPage-[A-Za-z0-9_-]+\.js", main)
    if vpf:
        rc3, vp = curl("/assets/" + vpf.group(0))
        check("影视分块可加载", rc3 == 0 and len(vp) > 10000, vpf.group(0), "bad")
        hlsf = re.search(r"hls-[A-Za-z0-9_-]+\.js", vp)
        check("hls 分块引用+可加载", bool(hlsf) and curl("/assets/" + hlsf.group(0))[0] == 0, (hlsf.group(0) if hlsf else "未引用"), "bad")
    else:
        check("影视分块引用", False, "主分块里找不到 VideoPage 引用", "bad")
for p in ["/img/3.jpg", "/img/avatar.webp"]:
    rc4, _ = curl(p)
    check("静态素材 %s" % p, rc4 == 0, "", "warn")

print()
print("=" * 74)
print("三、近 24h 错误日志（关键）")
print("=" * 74)
cmds = [
    ("nginx 5xx", "grep -hE '\" 50[0-9] ' /var/log/nginx/access.log 2>/dev/null | tail -3 | wc -l"),
    ("nginx 502/504(24h)", "awk -v d=\"$(date -d '24 hours ago' '+%d/%b/%Y')\" '$0 ~ d' /var/log/nginx/access.log 2>/dev/null | grep -cE '\" 50[24] ' || true"),
    ("wb-api 日志错误(近200行)", "journalctl -u wb-api -n 200 --no-pager 2>/dev/null | grep -ciE 'traceback|error|exception' || true"),
    ("wb-api 状态", "systemctl is-active wb-api"),
    ("nginx 状态", "systemctl is-active nginx"),
    ("fail2ban 状态", "systemctl is-active fail2ban"),
    ("磁盘使用", "df -h / | tail -1 | awk '{print $5}'"),
    ("内存", "free -m | awk 'NR==2{print $3\"/\"$2\"MB\"}'"),
    ("定时器", "systemctl list-timers --no-pager 2>/dev/null | grep -c wb- || true"),
]
for label, c in cmds:
    out = subprocess.run(["bash", "-lc", c], capture_output=True).stdout.decode().strip()
    print("  %-26s %s" % (label, out))

print()
print("=" * 74)
print("体检结果：PASS %d 项 / FAIL %d 项 / WARN %d 项" % (len(ok), len(bad), len(warn)))
if bad:
    print("❌ 失败项：", bad)
if warn:
    print("⚠️  警告项：", warn)
print("=" * 74)
