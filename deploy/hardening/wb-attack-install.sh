#!/usr/bin/env bash
# wb-attack-install.sh  v2 —— 装「我被打了吗」自检命令 + 指纹基线 + 攻击时间线
LC_ALL=C
export LC_ALL
ok(){ echo "  [PASS] $*"; }
sec(){ echo; echo "########## $* ##########"; }

sec "0. 准备目录"
install -d -m 700 /var/lib/wb-attack
ok "/var/lib/wb-attack"

sec "1. 指纹基线清单（可自行编辑）"
if [ ! -f /etc/wb-integrity.paths ]; then
cat > /etc/wb-integrity.paths <<'PEOF'
# wb-attack 指纹基线扫描范围：一行一个路径（目录递归）
# 改完这个文件后跑一次： wb-attack --baseline   重建基线
/opt/wb-api/server
/opt/wb-api/alembic
/opt/wb-api/.env
/opt/wb-api/weights
/opt/wb-api/requirements.txt
/etc/nginx
/etc/fail2ban
/etc/audit/rules.d
/etc/systemd/system/wb-api.service
/etc/systemd/system/wb-watchdog.service
/etc/systemd/system/wb-watchdog.timer
/etc/passwd
/etc/shadow
/etc/group
/etc/gshadow
/etc/sudoers
/etc/sudoers.d
/etc/crontab
/etc/cron.d
/etc/cron.daily
/etc/ssh/sshd_config
/etc/ssh/sshd_config.d
/usr/local/bin/wb-attack
/usr/local/sbin/wb-watchdog.sh
/root/.ssh/authorized_keys
/var/www/site
PEOF
  chmod 644 /etc/wb-integrity.paths
  ok "已写入 /etc/wb-integrity.paths"
else
  ok "/etc/wb-integrity.paths 已存在，保留原样"
fi

sec "2. 攻击者白名单（先把自己排除掉）"
if [ ! -f /etc/wb-attack.trusted ]; then
  MYIP=$(curl -s --max-time 3 http://100.100.100.200/latest/meta-data/eipv4 2>/dev/null)
  [ -z "$MYIP" ] && MYIP="115.29.242.211"
cat > /etc/wb-attack.trusted <<TEOF
# wb-attack 的「这不是攻击者」白名单：一行一个 IP
# 把你自己家里的宽带出口 IP 加进来，否则你自己在外网访问/压测会被算成"攻击者"
$MYIP
TEOF
  chmod 644 /etc/wb-attack.trusted
  ok "已写入 /etc/wb-attack.trusted（本机公网 IP $MYIP）"
else
  ok "/etc/wb-attack.trusted 已存在，保留"
fi

sec "3. 安装 wb-attack"
cat > /usr/local/bin/wb-attack <<'ATEOF'
#!/usr/bin/env bash
# wb-attack —— 大白话回答「我被打了吗 / 打哪儿 / 拦住没有 / 有没有被打穿」
#   用法：  wb-attack            看完整报告
#           wb-attack -q         只看有没有"被打穿"（静默，用于定时任务）
#           wb-attack --baseline 做了合法改动后，重建指纹基线
LC_ALL=C
export LC_ALL
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
export PATH
set -u
cd / 2>/dev/null || true

B=$(printf '\033[1m'); N=$(printf '\033[0m')
G=$(printf '\033[32m'); R=$(printf '\033[31m'); Y=$(printf '\033[33m'); C=$(printf '\033[36m')
hdr(){ echo; echo "${B}$*${N}"; printf '%s\n' "${B}$(printf '%.0s-' $(seq 1 62))${N}"; }

BASE=/var/lib/wb-attack/baseline.sha256
STAMP=/var/lib/wb-attack/baseline.at
CUR=/var/lib/wb-attack/.cur
PATHS=/etc/wb-integrity.paths
TRUST=/etc/wb-attack.trusted
ALOG=/var/log/nginx/access.log
DIRTY=0
mkdir -p /var/lib/wb-attack 2>/dev/null

# 从 access.log 里剥出"真正的对手"：剔除内网，再剔除你自己登记在白名单里的 IP
# （否则你自己在外网压测/访问，也会被算成"攻击者"）
ext(){
  awk '{print $1}' \
  | grep -vE '^(127\.|::1|10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|100\.100\.|169\.254\.)' \
  | { if [ -s "$TRUST" ]; then grep -vFf <(grep -vE '^[[:space:]]*(#|$)' "$TRUST"); else cat; fi; }
}

MODE=report
[ "${1:-}" = "-q" ] && MODE=quiet
[ "${1:-}" = "--baseline" ] && MODE=baseline

# ============ 关键文件指纹 ============
# 输出 `<哈希>[TAB]<绝对路径>`；软链接输出 `link:<目标>[TAB]<路径>`
scan(){
  while IFS= read -r p; do
    case "${p:-}" in ''|'#'*) continue;; esac
    if [ -d "$p" ]; then
      find "$p" \( -type f -o -type l \) -print0 2>/dev/null
    elif [ -f "$p" ] || [ -L "$p" ]; then
      printf '%s\0' "$p"
    fi
  done < "$PATHS" 2>/dev/null \
  | sort -zu \
  | while IFS= read -r -d '' f; do
      if [ -L "$f" ]; then
        printf 'link:%s\t%s\n' "$(readlink "$f" 2>/dev/null)" "$f"
      else
        printf '%s\t%s\n' "$(sha256sum -- "$f" 2>/dev/null | cut -d' ' -f1)" "$f"
      fi
    done
}

if [ "$MODE" = baseline ] || [ ! -s "$BASE" ]; then
  scan | sort > "$CUR" 2>/dev/null
  cp -f "$CUR" "$BASE"
  chmod 600 "$BASE"
  date '+%F %T' > "$STAMP"
  n=$(wc -l < "$BASE")
  [ "$MODE" = baseline ] && echo "${G}已重建指纹基线：$n 个文件${N}  （时间 $(cat "$STAMP")）"
fi

scan | sort > "$CUR" 2>/dev/null
n_base=$(wc -l < "$BASE" 2>/dev/null || echo 0)
# 一次性算出「内容被改 / 新增 / 消失」——注意不能用 comm 直接比，
# 被改的文件在 comm 里会同时算进"新增"，会重复计数
DIFF=$(awk -F'\t' '
  FNR==NR { b[$2]=$1; next }
  { c[$2]=$1 }
  END {
    for (p in c) { if (p in b) { if (b[p]!=c[p]) print "CH\t" p } else print "ADD\t" p }
    for (p in b) if (!(p in c)) print "RM\t" p
  }' "$BASE" "$CUR" 2>/dev/null | sort || true)
changed=$(printf '%s\n' "$DIFF" | awk -F'\t' '$1=="CH"{print $2}')
added=$(printf '%s\n'   "$DIFF" | awk -F'\t' '$1=="ADD"{print $2}')
removed=$(printf '%s\n' "$DIFF" | awk -F'\t' '$1=="RM"{print $2}')
n_add=$(printf '%s' "$added"   | grep -c . || true)
n_rm=$(printf '%s' "$removed" | grep -c . || true)
n_ch=$(printf '%s' "$changed" | grep -c . || true)
[ "$n_ch" -gt 0 ] && DIRTY=1

# ============ 基线之后新被改动的文件（含子目录 / venv，指纹扫不到的那部分）====
NEWF=""
if [ -s "$STAMP" ]; then
  ref=$(cat "$STAMP")
  NEWF=$(find /opt/wb-api /etc/nginx /etc/fail2ban /etc/systemd/system /usr/local/bin /usr/local/sbin /var/www/site \
        -xdev -type f -newermt "$ref" 2>/dev/null \
        | grep -vE '(__pycache__|\.pyc$|/logs?/|\.log$|/\.git/|/tmp/|/\.cache/)' | head -25 || true)
fi
n_new=$(printf '%s' "$NEWF" | grep -c . || true)
[ "$n_new" -gt 0 ] && DIRTY=1

# ============ 内核审计 ============
# 只看**基线建立之后**的动作：否则今天白天我们自己做加固留下的记录会天天报红，
# 报到最后你就不看了——告警一旦会撒谎，就等于没有告警
MINEPOCH=0
[ -s "$STAMP" ] && MINEPOCH=$(date -d "$(cat "$STAMP")" +%s 2>/dev/null)
MINEPOCH=${MINEPOCH:-0}
# akb：吐出某个 key 在基线之后的原始 SYSCALL 行
akb(){
  ausearch -k "$1" --start today 2>/dev/null \
    | grep 'type=SYSCALL' | grep -v 'comm="auditctl"' \
    | awk -v m="$MINEPOCH" '{ if (match($0,/audit\([0-9]+/)) { t=substr($0,RSTART+6,RLENGTH-6)+0; if (t>m) print } }'
}
ausearch_keys(){ akb "$1" | grep -c . || true; }
A_HITS=""
A_HIGH=""
# 高危：动到账户/密钥/后端代码/模型/云凭据/内核模块 → 命中就报警
KEY_HIGH="wb_identity wb_priv wb_sshkey wb_app_code wb_app_secret wb_app_model wb_cloud_creds wb_kmod"
# 低危：本身就是配置微调（nginx/fail2ban/sshd 配置、静态文件）→ 只展示，不报警
KEY_LOW="wb_sshd wb_nginx wb_f2b wb_site"
for k in $KEY_HIGH $KEY_LOW; do
  n=$(ausearch_keys "$k")
  if [ "$n" -gt 0 ]; then
    A_HITS="$A_HITS$k=$n "
    case " $KEY_HIGH " in *" $k "*) A_HIGH="$A_HIGH$k=$n ";; esac
  fi
done
# 只有高危命中才算"可能被打穿"；低危命中不触发告警（否则每次调个 nginx 都会误报）
[ -n "$A_HIGH" ] && DIRTY=1

# ============ 静默模式：给定时任务用 ============
if [ "$MODE" = quiet ]; then
  [ "$DIRTY" = 0 ] && exit 0
  echo "wb-attack: 关键文件/审计有变动 指纹变更=$n_ch 新增=$n_add 删除=$n_rm 近期改动=$n_new 审计命中:${A_HITS:-无}"
  exit 1
fi

# ============ 日志统计 ============
# 注意 1：必须锚定在请求行结束的引号后（`" 444 `），否则会把"响应字节数 548"
#         之类的数字当成状态码——上一版就栽在这，凭 548 字节的报错页误报出 365 条 5xx
# 注意 2：不能用 `grep -c ... || echo 0`。grep -c 无匹配时会**先打印 0 再返回 1**，
#         于是变成 "0\n0"，后面做整数比较就炸——上一版又栽在这
st(){ n=$(grep -cE "\" $1 " "$ALOG" 2>/dev/null); echo "${n:-0}"; }
if [ -f "$ALOG" ]; then
  c444=$(st 444)
  c429=$(st 429)
  c403=$(st 403)
  c503=$(st 503)
  n=$(grep -cE '" 50[024] ' "$ALOG" 2>/dev/null); c5xx=${n:-0}   # 500/502/504 才是真故障
  total=$(wc -l < "$ALOG" 2>/dev/null); total=${total:-0}
else
  c444=0; c429=0; c403=0; c503=0; c5xx=0; total=0
fi
prev444=$(cat /var/lib/wb-attack/last444 2>/dev/null || echo "$c444")
delta=$(( c444 - prev444 )); [ "$delta" -lt 0 ] && delta=0
banned_n=$(iptables -S 2>/dev/null | grep -cE 'f2b.*REJECT' || true)

echo "${B}====== 越的网站 · 服务器安全自检 ======${N}   $(date '+%F %T')"

# ---------- 一句话结论 ----------
hdr "结论"
if [ "$c5xx" -gt 20 ]; then
  echo "  ${R}${B}⚠ 要立刻看一眼${N}：后端出现 $c5xx 次真故障（500/502/504），可能是服务被打崩了"
  echo "    （另有 $c503 次 503 = 限流拒绝，属防护正常工作，不算故障）"
elif [ -f /var/lib/wb-traffic/stopped ]; then
  echo "  ${R}${B}⚠ 流量守卫已自动停站${N}：本月流量超了 20GB 免费额度（大概率是被人打）"
elif [ "$DIRTY" = 1 ]; then
  echo "  ${Y}${B}● 有关键文件变动待你确认${N}（见第 4 节；如果是你自己或我改的，属正常）"
elif [ "$delta" -ge 50 ]; then
  echo "  ${Y}${B}● 有人正在打你，但已经被拦住了${N}（近 5 分钟新增 $delta 次拦截）"
elif [ "$c444" -gt 100 ]; then
  echo "  ${C}${B}● 今天有人在扫你，属常态，全部被拦${N}（累计 $c444 次）"
else
  echo "  ${G}${B}✓ 一切正常${N}：拦截量很低（$c444 次），关键文件没被改，无入侵痕迹"
fi

hdr "先分清两件事"
echo "  ${C}被扫描 / 被打${N} = 有人在外面试探 → 全网每台公网机器每天都遇到，属常态"
echo "  ${R}被打穿${N}         = 有人进到系统里了 → 这才叫出事，看第 4 节"

# ---------- 1 ----------
hdr "1. 挡住多少（今天累计）"
printf '  %-30s %s\n' "444 恶意请求直接断连" "$c444 次"
printf '  %-30s %s\n' "429 刷接口被限流"     "$c429 次"
printf '  %-30s %s\n' "403 探测敏感文件被拒" "$c403 次"
printf '  %-30s %s\n' "503 限流拒绝（正常）" "$c503 次"
printf '  %-30s %s\n' "500/502/504 真故障"   "$c5xx 次"
printf '  %-30s %s\n' "总访问行数"           "$total"
echo "  ${Y}444/403/503 高都是好事${N}（说明防护在干活）；只有 500/502/504 高才是坏事"

# ---------- 2 ----------
hdr "2. 谁在打你（外网来源 Top 8）"
grep -E '" (444|403) ' "$ALOG" 2>/dev/null | ext \
  | sort | uniq -c | sort -rn | head -8 | while read -r n ip; do
      printf '  %-20s %s 次\n' "$ip" "$n"; done
echo "  ${Y}（已排除内网和你在 $TRUST 里登记的白名单 IP；这些才是要打你的人）${N}"

# ---------- 3 ----------
hdr "3. 他们在打什么（Top 10 被拦路径）"
grep -E '" (444|403) ' "$ALOG" 2>/dev/null | awk '{print $7}' \
  | sort | uniq -c | sort -rn | head -10 \
  | while read -r n p; do printf '  %-44s %s 次\n' "${p:0:44}" "$n"; done
echo "  ${Y}wp-login / .env / phpinfo 这类 = 自动化扫描器找已知漏洞，不用慌${N}"

# ---------- 4 ★ ----------
hdr "4. ★ 有没有被打穿（关键）"
echo "  ${B}[A] 关键文件指纹（内容级）${N}"
if [ ! -s "$BASE" ]; then
  echo "    ${Y}尚无基线，本次已建立，下次起才有对比$N"
elif [ "$n_ch" = 0 ] && [ "$n_add" = 0 ] && [ "$n_rm" = 0 ]; then
  echo "    ${G}✓ $n_base 个文件指纹全部一致，没有被改动${N}   基线时间 $(cat "$STAMP" 2>/dev/null)"
else
  echo "    ${R}✗ 有变动（基线时间 $(cat "$STAMP" 2>/dev/null)）：${N}"
  [ "$n_ch" -gt 0 ] && { echo "      内容被改（$n_ch）："; printf '%s\n' "$changed" | head -10 | sed 's/^/        /'; }
  [ "$n_add" -gt 0 ] && { echo "      ${R}新增文件（$n_add）${N}："; printf '%s\n' "$added" | head -10 | sed 's/^/        /'; }
  [ "$n_rm" -gt 0 ] && { echo "      ${Y}文件消失（$n_rm）："; printf '%s\n' "$removed" | head -10 | sed 's/^/        /'; }
fi

echo
echo "  ${B}[B] 基线之后又被写过的文件（含子目录、venv，覆盖指纹盲区）${N}"
if [ -z "$NEWF" ]; then
  echo "    ${G}✓ 没有${N}"
else
  echo "    ${Y}以下 $n_new 个文件在基线之后被修改过：${N}"
  printf '%s\n' "$NEWF" | sed 's/^/      /'
  echo "    （服务重启会重写 __pycache__ 之类，已过滤；剩余项请对照你的运维动作）"
fi

echo
echo "  ${B}[C] 内核审计（auditd 实时记录，只算基线 $(cat "$STAMP" 2>/dev/null) 之后的动作）${N}"
if [ -z "$A_HITS" ]; then
  echo "    ${G}✓ 基线之后没有任何敏感文件/内核模块动作${N}"
else
  if [ -n "$A_HIGH" ]; then echo "    ${R}${B}高危命中（要留意）：$A_HIGH${N}"
  else echo "    ${G}高危命中：无${N}"; fi
  echo "    ${Y}全部命中：$A_HITS${N}"
  for k in $A_HITS; do
    kk=${k%%=*}
    echo "      ${Y}[$kk]${N}"
    akb "$kk" | tail -3 \
      | sed -E 's/.*audit\(([0-9]+)\.[0-9]+:[0-9]+\).*comm="([^"]*)".*/\1 \2/' \
      | while read -r t cm; do
          if [ -n "${t:-}" ] && [ "$t" -eq "$t" ] 2>/dev/null; then
            printf '        %s   %s\n' "$(date -d "@$t" '+%m-%d %H:%M:%S' 2>/dev/null || echo "$t")" "${cm:-?}"
          else
            printf '        %s\n' "$t ${cm:-}"
          fi
        done
  done
  echo "    ${Y}注意：① audit 的目录监视不递归，子目录改动靠 [A][B] 兜底${N}"
  echo "    ${Y}      ② 若时间落在你已知的运维时段（比如我今晚加固），那是我自己的改动${N}"
fi

echo
echo "  --- 真人登录后执行过的可疑程序（webshell 在这里露头）---"
hit=0
for c in bash sh dash curl wget nc ncat socat perl gcc cc; do
  n=$(ausearch -k wb_exec --start today 2>/dev/null | grep 'type=SYSCALL' | grep -c "comm=\"$c\"" || true)
  [ "${n:-0}" -gt 0 ] && { printf '    %-10s %s 次\n' "$c" "$n"; hit=1; }
done
[ "$hit" = 0 ] && echo "    ${G}没有${N}"
echo "    （此规则只记录真人登录会话 auid>=1000 发起的执行，系统服务不在此列；"
echo "      显示「没有」= 今天没人登录进来执行过东西，是好事）"

echo
echo "  --- 有没有人成功登录过服务器 ---"
lt=$(last -i -n 6 2>/dev/null | grep -vE '^(reboot|wtmp|btmp|$)' | head -5 || true)
if [ -z "$lt" ]; then echo "    ${G}无任何 SSH 登录记录（只有你手里那把密钥能登）${N}"; else
  printf '%s\n' "$lt" | sed 's/^/    /'; fi
fb=$(lastb -i 2>/dev/null | grep -c . || true)
echo "    ${Y}密码爆破失败 $fb 次（密码登录已关，撞不进来）${N}"

echo
echo "  --- 应用层数据量（暴涨=有人在批量刷）---"
q(){ sudo -u postgres psql -d wb_campus -tAc "$1" 2>/dev/null | tr -d ' '; }
u=$(q "select count(*) from users;"); d=$(q "select count(*) from diagnosis_records;")
g=$(q "select count(*) from guestbook_messages;")
echo "    注册用户=$u  诊断记录=$d  留言=${g:-0}"

# ---------- 5 ----------
hdr "5. 现在正被封禁的 IP"
any=0
for j in $(fail2ban-client status 2>/dev/null | grep 'Jail list' | sed 's/.*://;s/,//g'); do
  e=$(fail2ban-client status "$j" 2>/dev/null | awk -F'\t' '/Banned IP list/{print $2}')
  if [ -n "$(echo "$e" | tr -d ' ')" ]; then echo "  [$j] $e"; any=1; fi
done
[ "$any" = 0 ] && echo "  ${G}当前没有 IP 被封（眼下没有正在进行中的攻击）${N}"
echo "  iptables 里真实生效的封禁规则：$banned_n 条（这个数字才作数）"

# ---------- 6 ----------
hdr "6. 最近几次攻击高峰（时间线）"
if [ -s /var/log/wb-attack.log ]; then tail -12 /var/log/wb-attack.log | sed 's/^/  /'
else echo "  （还没有记录；每小时自动记一次，出现攻击高峰或被改文件才会有条目）"; fi

# ---------- 7 ----------
hdr "7. 该怎么办"
if [ "$DIRTY" = 1 ]; then
cat <<'TXT'
  上面出现红色/黄色，按下面判断：
   · 变动时间 = 你/我做运维的时间 → 正常，跑一次  wb-attack --baseline  更新基线即可
   · 变动时间对不上，或出现你不认识的文件 → 先别删，把这几行发出来，我来判断
TXT
elif [ -f /var/lib/wb-traffic/stopped ]; then
  echo "  流量守卫已停站，确认后恢复： systemctl start nginx && rm -f /var/lib/wb-traffic/stopped"
else
cat <<'TXT'
  · 一般扫描：什么都不用做，日志里那些 444/403 就是被挡下的证据
  · 临时封某个 IP：  fail2ban-client set wb-nginx banip <IP>
  · 查某个 IP 干了啥：grep '<IP>' /var/log/nginx/access.log | tail -20
  · 看服务是否正常： wb-health
  · 做了合法改动后： wb-attack --baseline    （重建指纹基线）
  · 你自己的 IP 被当成攻击者：echo '<你的IP>' >> /etc/wb-attack.trusted
TXT
fi
echo
echo "  ${B}一句话：${N}第 4 节全是绿的、第 5 节没有陌生 IP，就说明你只是被扫，没被打穿。"
echo
exit 0
ATEOF
chmod 755 /usr/local/bin/wb-attack
bash -n /usr/local/bin/wb-attack && ok "wb-attack 语法通过" || { echo "  语法错误"; exit 1; }

sec "4. 建立首次指纹基线"
bash /usr/local/bin/wb-attack --baseline
[ -s /var/lib/wb-attack/baseline.sha256 ] && ok "基线已建立：$(wc -l < /var/lib/wb-attack/baseline.sha256) 个文件" || echo "  基线建立失败"

sec "5. 看门狗加两项：攻击时间线 + 文件改动巡检"
if grep -q 'wb-attack-timeline' /usr/local/sbin/wb-watchdog.sh 2>/dev/null; then
  ok "已存在，跳过"
else
cat >> /usr/local/sbin/wb-watchdog.sh <<'WDEOF'

# ===== wb-attack-timeline =====
LOG_ATK=/var/log/wb-attack.log
touch "$LOG_ATK"; chmod 600 "$LOG_ATK"
H=$(date +%Y%m%d%H)
L=$(cat /var/lib/wb-attack/lasthour 2>/dev/null || echo "")

# ① 攻击高峰：近 5 分钟被拦 >= 30 次
#（不要写 `grep -c ... || echo 0`：无匹配时 grep 会先打印 0 再返回 1，结果变成两行）
cur=$(grep -c ' 444 ' /var/log/nginx/access.log 2>/dev/null); cur=${cur:-0}
prev=$(cat /var/lib/wb-attack/last444 2>/dev/null || echo "$cur")
delta=$(( cur - prev )); [ "$delta" -lt 0 ] && delta=0
echo "$cur" > /var/lib/wb-attack/last444 2>/dev/null
if [ "$delta" -ge 30 ] && [ "$L" != "$H" ]; then
  echo "$H" > /var/lib/wb-attack/lasthour 2>/dev/null
  echo "[$(date '+%m-%d %H:%M')] 攻击高峰：近 5 分钟被拦 $delta 次（今日累计 $cur）" >> "$LOG_ATK"
  top=$(grep -E ' (444|403) ' /var/log/nginx/access.log 2>/dev/null | awk '{print $1}' \
        | grep -vE '^(127\.|::1|10\.|172\.|192\.168\.)' \
        | sort | uniq -c | sort -rn | head -1 | awk '{print $2}')
  [ -n "$top" ] && echo "          最活跃来源: $top" >> "$LOG_ATK"
fi

# ② 文件改动：每小时最多记一次
HI=$(cat /var/lib/wb-attack/lastintegrity 2>/dev/null || echo "")
if [ "$HI" != "$H" ] && [ -s /var/lib/wb-attack/baseline.sha256 ]; then
  if ! /usr/local/bin/wb-attack -q >> "$LOG_ATK.tmp" 2>&1; then
    echo "$H" > /var/lib/wb-attack/lastintegrity 2>/dev/null
    echo "[$(date '+%m-%d %H:%M')] 关键文件变动告警：" >> "$LOG_ATK"
    sed 's/^/          /' "$LOG_ATK.tmp" >> "$LOG_ATK"
    echo "          （若为你自己的运维改动，跑 wb-attack --baseline 重建基线）" >> "$LOG_ATK"
  fi
  rm -f "$LOG_ATK.tmp"
fi
WDEOF
  sh -n /usr/local/sbin/wb-watchdog.sh && ok "看门狗脚本语法通过" || echo "  语法错误"
fi

cat > /etc/logrotate.d/wb-attack <<'LR'
/var/log/wb-attack.log {
    monthly
    rotate 12
    compress
    missingok
    notifempty
    create 600 root root
}
LR
ok "logrotate 已配（保留 12 个月）"

sec "6. 马上跑一次给你看"
# 上面刚写完 wb-watchdog.sh 自身，会算作"新改动"；先按当前状态重建基线，避免演示时出现假告警
bash /usr/local/bin/wb-attack --baseline
echo
bash /usr/local/sbin/wb-watchdog.sh 2>&1 | tail -5
echo
echo "（时间线日志：$(wc -l < /var/log/wb-attack.log 2>/dev/null || echo 0) 行）"
echo
bash /usr/local/bin/wb-attack
