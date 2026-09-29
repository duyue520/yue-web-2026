#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""修正自愈匹配：按 key 名（internal-avatar）+ 12 字符前缀双条件启用内部 key"""
import io
import os

for _line in open("/opt/wb-api/.env", encoding="utf-8"):
    _line = _line.strip()
    if not _line or _line.startswith("#") or "=" not in _line:
        continue
    _k, _v = _line.split("=", 1)
    os.environ.setdefault(_k.strip(), _v.strip().strip('"'))

import psycopg

KEY = os.environ.get("AI_DOUBAO_KEY", "")
P12 = KEY[:12]
print("内部 key 前 12 位: %s…（总长 %d）" % (P12, len(KEY)))

dsn = [l.split("=", 1)[1].strip() for l in open("/opt/wb-api/.env") if l.startswith("DATABASE_URL")][0]
dsn = dsn.replace("postgresql+psycopg://", "postgresql://")
cc = psycopg.connect(dsn)
cur = cc.cursor()

cur.execute("""
UPDATE ai_keys SET enabled = true
WHERE enabled = false
  AND (name = 'internal-avatar' OR key_prefix LIKE %s)
""", (P12 + "%",))
print("[OK] 启用内部 key：影响 %d 行" % cur.rowcount)
cc.commit()

cur.execute("SELECT id, name, user_id, key_prefix, enabled FROM ai_keys ORDER BY id")
print("当前密钥表:")
for r in cur.fetchall():
    print("   id=%s name=%s user=%s prefix=%s enabled=%s" % r)
cc.close()

# 修正 ai.py 的自愈匹配逻辑（12 字符前缀 + 名称双条件）
P = "/opt/wb-api/server/routers/ai.py"
src = io.open(P, encoding="utf-8").read().replace("\r\n", "\n")
old = '''        pfx = (os.environ.get("AI_DOUBAO_KEY") or "")[:16]
        if not pfx:
            return False
        with engine.connect() as conn:
            r = conn.execute(sql_text(
                "UPDATE ai_keys SET enabled = true WHERE key_prefix LIKE :p AND enabled = false"),
                {"p": pfx + "%"})'''
new = '''        pfx = (os.environ.get("AI_DOUBAO_KEY") or "")[:12]
        if not pfx:
            return False
        with engine.connect() as conn:
            r = conn.execute(sql_text(
                "UPDATE ai_keys SET enabled = true WHERE enabled = false "
                "AND (name = 'internal-avatar' OR key_prefix LIKE :p)"),
                {"p": pfx + "%"})'''
if old in src:
    src = src.replace(old, new, 1)
    io.open(P, "w", encoding="utf-8", newline="\n").write(src)
    import ast
    ast.parse(src)
    print("[OK] ai.py 自愈匹配已修正")
else:
    print("[SKIP] ai.py 匹配逻辑无需修改" if new in src else "[WARN] 未找到目标片段")
