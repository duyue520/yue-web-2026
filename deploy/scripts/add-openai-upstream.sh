#!/bin/bash
# 用法: bash add-openai-upstream.sh <base_url> <key1[,key2,...]> <model1[,model2,...]> [频道名]
# 示例: bash add-openai-upstream.sh https://api.xxx.com/v1 sk-xxx,gpt-4o-mini,gpt-4o ChatGPT中转
set -e
BASE="$1"; KEYS="$2"; MODELS="$3"; NAME="${4:-ChatGPT号池}"
[ -z "$BASE" ] || [ -z "$KEYS" ] || [ -z "$MODELS" ] && { echo "参数: <base_url> <keys逗号分隔> <models逗号分隔> [名称]"; exit 1; }
ADMIN=$(grep "^AI_GW_ADMIN_TOKEN=" /opt/wb-api/.env | cut -d= -f2)
/opt/wb-api/venv/bin/python - "$NAME" "$BASE" "$KEYS" "$MODELS" "$ADMIN" <<'PYEOF'
import json, sys, urllib.request
name, base, keys, models, admin = sys.argv[1:6]
body = json.dumps({"name": name, "kind": "openai", "base_url": base.rstrip("/"),
                   "accounts": [k.strip() for k in keys.split(",") if k.strip()],
                   "models": [m.strip() for m in models.split(",") if m.strip()],
                   "enabled": True}).encode()
req = urllib.request.Request("http://127.0.0.1:7860/api/ai-gw/admin/upstreams", data=body, method="POST",
                             headers={"Content-Type": "application/json", "X-Admin-Token": admin})
print("upsert:", urllib.request.urlopen(req, timeout=15).read().decode().strip())
PYEOF
echo "[OK] 频道已入池，多 key 自动轮换+失败冷却"
echo "[VERIFY] 当前模型列表:"
IKEY=$(cat /opt/wb-api/.env.aigw-internal-key)
curl -sS -m 10 http://127.0.0.1:7860/v1/models -H "Authorization: Bearer $IKEY"
echo
