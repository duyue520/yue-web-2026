#!/bin/bash
# 用法: bash add-doubao-sid.sh <sessionid1>[,<sessionid2>,...]
# 效果: 1) 豆包网页版账号池写入网关（多号自动轮换+失败冷却）
#       2) 「越的分身」豆包路由改走网关（内部密钥）
#       3) 重启 wb-api 生效
set -e
SIDS="$1"
[ -z "$SIDS" ] && { echo "需要 sessionid 参数"; exit 1; }
API=http://127.0.0.1:7860
ADMIN=$(grep "^AI_GW_ADMIN_TOKEN=" /opt/wb-api/.env | cut -d= -f2)
VPY=/opt/wb-api/venv/bin/python

# 1) 账号池 upsert
$VPY - "$SIDS" "$ADMIN" <<'PYEOF'
import json, sys, urllib.request
sids = [x.strip() for x in sys.argv[1].split(",") if x.strip()]
admin = sys.argv[2]
body = json.dumps({"name": "豆包网页版", "kind": "doubao-web", "base_url": "",
                   "accounts": sids, "models": ["doubao-web"], "enabled": True}).encode()
req = urllib.request.Request("http://127.0.0.1:7860/api/ai-gw/admin/upstreams",
                             data=body, method="POST",
                             headers={"Content-Type": "application/json", "X-Admin-Token": admin})
print("[OK] upstream:", urllib.request.urlopen(req, timeout=15).read().decode().strip())
PYEOF

# 2) 内部密钥（给「越的分身」用），持久化在 .env.aigw-internal-key
IKF=/opt/wb-api/.env.aigw-internal-key
if [ -f "$IKF" ]; then
  IKEY=$(cat "$IKF")
  echo "[SKIP] internal key exists"
else
  IKEY=$($VPY -c "import secrets;print('sk-wb-'+secrets.token_hex(16))")
  echo "$IKEY" > "$IKF"; chmod 600 "$IKF"
  HASH=$(printf '%s' "$IKEY" | sha256sum | cut -d' ' -f1)
  $VPY - "$HASH" "${IKEY:0:14}" <<'PYEOF2'
import sys, psycopg
hash_, prefix = sys.argv[1], sys.argv[2]
dsn = [l.split("=", 1)[1].strip() for l in open("/opt/wb-api/.env") if l.startswith("DATABASE_URL")][0]
dsn = dsn.replace("postgresql+psycopg://", "postgresql://")
c = psycopg.connect(dsn); cur = c.cursor()
cur.execute("INSERT INTO ai_keys (user_id, name, key_hash, key_prefix, rpm, daily_limit) "
            "SELECT id, 'internal-avatar', %s, %s, 60, 2000 FROM users ORDER BY id LIMIT 1 "
            "ON CONFLICT (key_hash) DO NOTHING", (hash_, prefix))
c.commit()
print("[OK] internal key inserted")
PYEOF2
fi

# 3) 「越的分身」豆包路由 → 指向网关
sed -i 's|^AI_DOUBAO_BASE=.*|AI_DOUBAO_BASE=http://127.0.0.1:7860/v1|' /opt/wb-api/.env
sed -i "s|^AI_DOUBAO_KEY=.*|AI_DOUBAO_KEY=$IKEY|" /opt/wb-api/.env
sed -i 's|^AI_DOUBAO_MODEL=.*|AI_DOUBAO_MODEL=doubao-web|' /opt/wb-api/.env

# 4) 重启生效并验证
systemctl restart wb-api
sleep 6
echo "[VERIFY] 网关模型列表:"
curl -sS -m 10 $API/v1/models -H "Authorization: Bearer $IKEY"
echo
echo "=== DONE：账号池已就绪，分身与网关共用该账号池 ==="
