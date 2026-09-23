#!/bin/bash
# ============================================================
#  阿里云 ECS 部署准备脚本
#  实例: i-bp1ff5hggt64nhbbp8680Z
#  公网 IP: 115.29.242.211   系统: Alibaba Cloud Linux 3.2104 LTS
#
#  用法：在阿里云控制台点这台实例的蓝色「远程连接」按钮，
#        进入网页终端后，把下面整段复制粘贴进去回车执行。
# ============================================================

set -e

echo "=== 1/4  放行 WorkBuddy 部署公钥 ==="
mkdir -p /root/.ssh
chmod 700 /root/.ssh
touch /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
if grep -q "workbuddy-deploy" /root/.ssh/authorized_keys; then
  echo "公钥已存在，跳过"
else
  echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINWjj60+9J81FJN9Jb+X24u624j5oFoIEpThJPX3Vhf2 workbuddy-deploy" >> /root/.ssh/authorized_keys
  echo "公钥已写入"
fi

echo "=== 2/4  安装 nginx ==="
dnf install -y nginx
systemctl enable --now nginx

echo "=== 3/4  放行防火墙端口 ==="
if systemctl is-active --quiet firewalld; then
  firewall-cmd --permanent --add-service=http
  firewall-cmd --permanent --add-service=https
  firewall-cmd --reload
  echo "firewalld 已放行 80/443"
else
  echo "firewalld 未运行，跳过"
fi

echo "=== 4/4  建立站点目录 ==="
mkdir -p /var/www/site
mkdir -p /var/www/site/campus
mkdir -p /var/www/site/qingming

echo
echo "============================================"
echo "  完成状态"
echo "============================================"
nginx -v
echo "nginx 状态: $(systemctl is-active nginx)"
echo "本机公网 IP: 115.29.242.211"
echo "站点目录: /var/www/site"
echo
echo "接下来由 WorkBuddy 通过 SSH 上传站点文件并配置 nginx。"

# ------------------------------------------------------------
# 如需撤销本次授权（删除公钥），执行：
#   sed -i '/workbuddy-deploy/d' /root/.ssh/authorized_keys
# ------------------------------------------------------------
