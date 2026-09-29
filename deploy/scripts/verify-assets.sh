#!/bin/bash
# 线上资源完整性校验（独立版，不依赖部署 stage）：index.html → 主分块 → VideoPage → 引用资源
set -u
cd /var/www/site
MISS=0
check_ref() {
  # 只认 Vite 哈希产物名（允许名字里有点，如 three.module-XXXX.js）
  for f in $(grep -oE "[A-Za-z0-9_.]+-[A-Za-z0-9_-]{8}\.(js|css)" "$1" | sort -u); do
    [ -f "assets/$f" ] || { echo "  MISS $f (被 $1 引用)"; MISS=$((MISS+1)); }
  done
}
echo "== 资源完整性校验 =="
check_ref index.html
IDX=$(grep -o "index-[A-Za-z0-9_-]*\.js" index.html | head -1)
if [ -f "assets/$IDX" ]; then
  echo "  主分块 OK: $IDX ($(stat -c%s "assets/$IDX") 字节)"
  check_ref "assets/$IDX"
else
  echo "  MISS 主分块 $IDX"; MISS=$((MISS+1))
fi
VP=$(grep -o "VideoPage-[A-Za-z0-9_-]*\.js" "assets/$IDX" 2>/dev/null | head -1)
if [ -n "$VP" ] && [ -f "assets/$VP" ]; then
  echo "  VideoPage OK: $VP ($(stat -c%s "assets/$VP") 字节)"
  check_ref "assets/$VP"
else
  echo "  MISS VideoPage 分块($VP)"; MISS=$((MISS+1))
fi
HLS=$(grep -o "hls-[A-Za-z0-9_-]*\.js" "assets/$VP" 2>/dev/null | head -1)
[ -n "$HLS" ] && { [ -f "assets/$HLS" ] && echo "  hls OK: $HLS" || { echo "  MISS hls $HLS"; MISS=$((MISS+1)); }; }
if [ "$MISS" = "0" ]; then echo "VERIFY_OK 资源完整"; else echo "VERIFY_FAILED 缺 $MISS 个资源（会导致白屏/功能缺失）"; exit 1; fi
