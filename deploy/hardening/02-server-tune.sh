#!/bin/bash
# ============================================================
#  服务器性能与资源调优
#  目标机器：2 vCPU / 2 GB 内存 / 8 Mbps 峰值 / 按流量计费
#  针对「省资源 + 快」两件事：
#    省资源 = 预压缩省 CPU、关静态日志省 IO、限流防刷爆流量费
#    快     = open_file_cache 免重复 stat、BBR 提吞吐、长缓存免重复下载
# ============================================================
set -e
cd /root

echo "########## 1. 预压缩静态文本资源（配合 gzip_static，请求时不用现压）##########"
cd /var/www/site
BEFORE=$(du -sb . | cut -f1)
N=0
while IFS= read -r f; do
  [ -f "$f.gz" ] && continue
  gzip -9 -k -f "$f" 2>/dev/null && N=$((N+1))
done < <(find . -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.json' \
        -o -name '*.svg' -o -name '*.xml' -o -name '*.lrc' \) -size +1k)
ORIG=$(find . -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.json' -o -name '*.svg' -o -name '*.xml' -o -name '*.lrc' \) -size +1k -exec stat -c%s {} + | awk '{s+=$1} END{print s+0}')
GZ=$(find . -name '*.gz' -exec stat -c%s {} + | awk '{s+=$1} END{print s+0}')
echo "  压缩 $N 个文件：$((ORIG/1024)) KB -> $((GZ/1024)) KB （省 $(( (ORIG-GZ)/1024 )) KB，约 $(( 100 - GZ*100/(ORIG>0?ORIG:1) ))%）"
cd /root

echo
echo "########## 2. 限流限速区（必须在 http{} 内，放 conf.d）##########"
cat > /etc/nginx/conf.d/00-wb-limits.conf <<'EOF'
# 单 IP 请求速率与并发上限 —— 防爬虫/恶意抓取刷爆按流量计费的带宽
limit_req_zone  $binary_remote_addr zone=wb_perip:10m rate=60r/s;
limit_conn_zone $binary_remote_addr zone=wb_conn:10m;
EOF
echo "  已写入 /etc/nginx/conf.d/00-wb-limits.conf"

echo
echo "########## 3. 站点 server 配置（default.d 是 server{} 内的扩展点）##########"
cat > /etc/nginx/default.d/site.conf <<'EOF'
charset utf-8;
server_tokens off;
client_max_body_size 64m;

sendfile     on;
tcp_nopush   on;
tcp_nodelay  on;

keepalive_timeout  30s;
keepalive_requests 500;

# 关键：169 个静态文件反复被 stat，缓存元数据后省掉大量系统调用
open_file_cache          max=8192 inactive=120s;
open_file_cache_valid    60s;
open_file_cache_min_uses 1;
open_file_cache_errors   on;

# gzip_static 优先直接吐预压缩的 .gz，命中时 CPU 开销≈0
gzip             on;
gzip_static      on;
gzip_comp_level  5;
gzip_min_length  1024;
gzip_vary        on;
gzip_proxied     any;
gzip_types text/plain text/css text/xml application/javascript application/json
           application/xml image/svg+xml application/wasm;

# 防刷：单 IP 60 请求/秒、最多 64 条并发连接（正常浏览远远用不到）
limit_req  zone=wb_perip burst=200 nodelay;
limit_conn wb_conn 64;

location = /index.html {
    add_header Cache-Control "no-cache";
}

# 带内容 hash 的构建产物：永不重复下载
location ~* ^/(assets|covers)/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}

# 图片/字体/视频：30 天缓存，且不写访问日志（省磁盘 IO 与 CPU）
location ~* \.(?:jpg|jpeg|png|gif|ico|svg|webp|avif|woff2?|ttf|eot|webm|mp4|lrc)$ {
    expires 30d;
    add_header Cache-Control "public, max-age=2592000";
    access_log off;
}

# 音乐：长缓存 + 单连接限速 4 Mbps
# 8 Mbps 峰值下，单人全速下载会占满整条带宽导致他人打不开；限速后仍可 2 人并行流畅
location ^~ /music/ {
    expires 30d;
    add_header Cache-Control "public, max-age=2592000";
    access_log off;
    limit_rate_after 2m;
    limit_rate 4m;
}
EOF
echo "  已写入 /etc/nginx/default.d/site.conf"

echo
echo "########## 4. 访问日志瘦身（只留 HTML 文档请求）##########"
if ! grep -q 'wb_minimal' /etc/nginx/nginx.conf; then
  sed -i "s|log_format  main  '\$remote_addr|log_format  wb_minimal  '\$remote_addr|" /etc/nginx/nginx.conf
  sed -i "s|access_log  /var/log/nginx/access.log  main;|access_log  /var/log/nginx/access.log  wb_minimal;|" /etc/nginx/nginx.conf
  echo "  已切换为精简日志格式"
else
  echo "  已配置过，跳过"
fi

echo
echo "########## 5. 内核网络调优 + BBR ##########"
cat > /etc/sysctl.d/99-wb-tuning.conf <<'EOF'
# BBR 拥塞控制：低带宽 + 有丢包时吞吐提升明显
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr
# 空闲后不重启慢启动，首字节更快
net.ipv4.tcp_slow_start_after_idle = 0
# TCP Fast Open
net.ipv4.tcp_fastopen = 3
net.core.netdev_max_backlog = 8192
net.ipv4.tcp_keepalive_time = 600
EOF
if ! lsmod | grep -q tcp_bbr; then modprobe tcp_bbr 2>/dev/null || true; fi
echo "tcp_bbr" > /etc/modules-load.d/bbr.conf 2>/dev/null || true
sysctl --system > /dev/null 2>&1
echo "  当前拥塞控制: $(sysctl -n net.ipv4.tcp_congestion_control)"
echo "  可用算法: $(sysctl -n net.ipv4.tcp_available_congestion_control)"

echo
echo "########## 6. 校验并重载 nginx ##########"
nginx -t 2>&1 && systemctl reload nginx && echo "  nginx 已重载"

echo
echo "########## 7. 结果 ##########"
echo "站点体积: $(du -sh /var/www/site | cut -f1)"
echo "预压缩文件: $(find /var/www/site -name '*.gz' | wc -l) 个"
echo "内存: $(free -m | awk '/Mem:/{print $3" MB 已用 / "$2" MB 总量"}')"
echo "负载: $(cat /proc/loadavg)"
