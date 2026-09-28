<template>
  <transition name="gw-fade">
    <div v-if="visible" class="gw-mask" @click.self="visible = false">
      <div class="gw-panel" :class="{ 'is-full': xs }">
        <div class="gw-aurora"><i class="a1"></i><i class="a2"></i><i class="a3"></i></div>

        <header class="gw-head">
          <div class="gw-face"><v-img :src="avatar" cover /></div>
          <div class="gw-who">
            <div class="gw-name">AI 开放接口<span class="gw-badge">OpenAI 兼容</span></div>
            <div class="gw-state"><i :class="['gw-dot', models.length ? 'ok' : 'off']"></i>{{ models.length ? `已接入 ${models.length} 个模型` : '暂未接入模型，等站长接线' }}</div>
          </div>
          <button class="gw-hbtn" title="刷新" @click="loadAll"><v-icon size="16">mdi-refresh</v-icon></button>
          <button class="gw-hbtn" title="收起" @click="visible = false"><v-icon size="16">mdi-close</v-icon></button>
        </header>

        <div class="gw-tabs">
          <button v-for="t in tabs" :key="t.id" :class="['gw-tab', { on: tab === t.id }]" @click="tab = t.id">
            <v-icon size="14">{{ t.icon }}</v-icon>{{ t.label }}
          </button>
        </div>

        <div class="gw-body">
          <!-- ============ 密钥管理 ============ -->
          <section v-show="tab === 'keys'" class="gw-sec">
            <div class="gw-tip">
              <v-icon size="14">mdi-key-outline</v-icon>
              创建密钥后即可用任意 OpenAI SDK / 客户端调用本站模型。
              接口地址：<code class="gw-code">https://heyiwei.tech/v1</code>
              <button class="gw-mini" @click="copy(baseUrl)">复制</button>
            </div>

            <div class="gw-newkey">
              <input v-model="newKeyName" class="gw-input" maxlength="20" placeholder="密钥备注（如：我的脚本）" @keyup.enter="createKey" />
              <button class="gw-btn" :disabled="creating" @click="createKey">
                <v-icon size="14">mdi-plus</v-icon>{{ creating ? '创建中…' : '创建密钥' }}
              </button>
            </div>
            <div class="gw-limit">每人最多 {{ maxKeys }} 把 · 单把每分钟 {{ 15 }} 次 · 每天 {{ 300 }} 次</div>

            <div v-if="freshKey" class="gw-fresh">
              <div class="gw-fresh-t"><v-icon size="14">mdi-alert</v-icon>密钥只显示这一次，请立即复制保存</div>
              <div class="gw-fresh-k"><code>{{ freshKey }}</code><button class="gw-btn sm" @click="copy(freshKey)">复制</button></div>
            </div>

            <div v-if="keys.length === 0 && !loading" class="gw-empty">还没有密钥，创建一把试试～</div>
            <transition-group name="gw-pop" tag="div">
              <div v-for="k in keys" :key="k.id" class="gw-keycard">
                <div class="gw-key-l">
                  <div class="gw-key-name">
                    <v-icon size="14" :class="{ dim: !k.enabled }">{{ k.enabled ? 'mdi-key-variant' : 'mdi-key-off' }}</v-icon>
                    {{ k.name }}<code class="gw-key-prefix">{{ k.key_prefix }}</code>
                  </div>
                  <div class="gw-key-meta">
                    累计 {{ k.total_calls }} 次 · 今日 {{ k.today_valid ? k.used_today : 0 }}/{{ k.daily_limit }}
                    <span v-if="k.last_used_at"> · 最近 {{ fmtTime(k.last_used_at) }}</span>
                  </div>
                </div>
                <div class="gw-key-r">
                  <button class="gw-mini" :title="k.enabled ? '停用' : '启用'" @click="toggleKey(k)">
                    <v-icon size="14">{{ k.enabled ? 'mdi-pause' : 'mdi-play' }}</v-icon>
                  </button>
                  <button class="gw-mini danger" title="删除" @click="deleteKey(k)"><v-icon size="14">mdi-delete-outline</v-icon></button>
                </div>
              </div>
            </transition-group>
          </section>

          <!-- ============ 模型广场 ============ -->
          <section v-show="tab === 'models'" class="gw-sec">
            <div class="gw-tip"><v-icon size="14">mdi-chart-bubble</v-icon>所有模型走同一接口地址，请求体里 <code class="gw-code">model</code> 填对应 id 即可。</div>
            <div v-if="models.length === 0 && !loading" class="gw-empty">站长还没接入频道，稍后再来看看～</div>
            <div class="gw-models">
              <div v-for="(m, i) in models" :key="m.id + i" class="gw-model">
                <div class="gw-model-ico"><v-icon size="18">{{ m.kind === 'doubao-web' ? 'mdi-creation' : 'mdi-robot-outline' }}</v-icon></div>
                <div class="gw-model-main">
                  <div class="gw-model-id">{{ m.id }}</div>
                  <div class="gw-model-up">{{ m.upstream }} · {{ m.kind === 'doubao-web' ? '豆包网页版' : 'OpenAI 兼容' }}</div>
                </div>
                <button class="gw-mini" title="去试用" @click="pickModel(m)"><v-icon size="14">mdi-play-circle-outline</v-icon></button>
              </div>
            </div>
          </section>

          <!-- ============ 在线试用 ============ -->
          <section v-show="tab === 'play'" class="gw-sec play">
            <div v-if="!loggedIn" class="gw-empty big">
              <v-icon size="30">mdi-lock-outline</v-icon>
              <p>登录后即可免费试用全部模型（每小时 30 次）</p>
            </div>
            <template v-else>
              <div class="gw-play-head">
                <select v-model="playModel" class="gw-select">
                  <option v-for="(m, i) in models" :key="m.id + i" :value="m.id">{{ m.id }}（{{ m.upstream }}）</option>
                </select>
                <button class="gw-mini" @click="playMsgs = []"><v-icon size="14">mdi-broom</v-icon>清空</button>
              </div>
              <div class="gw-flow" ref="flow">
                <div v-if="!playMsgs.length" class="gw-empty">选好模型，说点什么吧～</div>
                <div v-for="(m, i) in playMsgs" :key="i" :class="['gw-msg', m.role]">
                  <div class="gw-bub" :class="{ err: m.err }">{{ m.text }}<span v-if="m.stream" class="gw-caret"></span></div>
                </div>
              </div>
              <div class="gw-inputrow">
                <input v-model="playInput" class="gw-input" maxlength="2000" placeholder="输入消息，Enter 发送"
                       :disabled="playBusy" @keyup.enter="playSend" />
                <button class="gw-btn" :disabled="playBusy || !playModel" @click="playSend">
                  <v-icon size="14">{{ playBusy ? 'mdi-loading mdi-spin' : 'mdi-send' }}</v-icon>
                </button>
              </div>
            </template>
          </section>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import api from '../services/api.js';

export default {
  name: 'AiGateway',
  props: { avatar: { type: String, default: '/img/avatar.webp' } },
  data() {
    return {
      xs: false,
      visible: false,
      loading: false,
      tab: 'keys',
      tabs: [
        { id: 'keys', label: '我的密钥', icon: 'mdi-key-chain' },
        { id: 'models', label: '模型广场', icon: 'mdi-view-grid-outline' },
        { id: 'play', label: '在线试用', icon: 'mdi-chat-processing-outline' },
      ],
      models: [],
      keys: [],
      maxKeys: 5,
      baseUrl: 'https://heyiwei.tech/v1',
      newKeyName: '',
      creating: false,
      freshKey: '',
      freshTimer: null,
      playModel: '',
      playMsgs: [],
      playInput: '',
      playBusy: false,
    };
  },
  computed: {
    loggedIn() { return api.isLoggedIn(); },
  },
  mounted() {
    try { this.xs = window.innerWidth < 700; } catch (e) { this.xs = false; }
  },
  methods: {
    open() {
      this.visible = true;
      this.loadAll();
    },
    async loadAll() {
      if (!api.isLoggedIn()) { this.tab = 'play'; return; }
      this.loading = true;
      try {
        const d = await api.aiGwOverview();
        this.models = d.models || [];
        this.keys = d.keys || [];
        this.maxKeys = d.max_keys || 5;
        if (!this.playModel && this.models.length) this.playModel = this.models[0].id;
      } catch (e) {
        console.warn('ai-gw overview failed:', e.message);
      }
      this.loading = false;
    },
    copy(text) {
      const done = () => {};
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => this.fallbackCopy(text));
      } else this.fallbackCopy(text);
    },
    fallbackCopy(text) {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
    },
    async createKey() {
      if (this.creating) return;
      this.creating = true;
      try {
        const d = await api.aiGwCreateKey(this.newKeyName || '默认密钥');
        this.freshKey = d.key;
        clearTimeout(this.freshTimer);
        this.freshTimer = setTimeout(() => { this.freshKey = ''; }, 120000);
        this.newKeyName = '';
        await this.loadAll();
      } catch (e) { alert(e.message || '创建失败'); }
      this.creating = false;
    },
    async toggleKey(k) {
      try { await api.aiGwToggleKey(k.id); k.enabled = !k.enabled; } catch (e) { alert(e.message); }
    },
    async deleteKey(k) {
      if (!confirm('确定删除密钥「' + k.name + '」？使用它的客户端会立刻失效。')) return;
      try { await api.aiGwDeleteKey(k.id); this.keys = this.keys.filter(x => x.id !== k.id); } catch (e) { alert(e.message); }
    },
    pickModel(m) {
      this.playModel = m.id;
      this.tab = 'play';
    },
    fmtTime(t) {
      try {
        const d = new Date(t);
        return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
      } catch (e) { return ''; }
    },
    async playSend(preset) {
      const text = (typeof preset === 'string' ? preset : this.playInput || '').trim();
      if (!text || this.playBusy || !this.playModel) return;
      this.playInput = '';
      this.playBusy = true;
      this.playMsgs.push({ role: 'user', text });
      const ai = { role: 'assistant', text: '', stream: true };
      this.playMsgs.push(ai);
      this.scrollFlow();
      try {
        const token = localStorage.getItem('disease_token') || '';
        const res = await fetch('/api/ai-gw/playground', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({ model: this.playModel, messages: [{ role: 'user', content: text }] }),
        });
        if (!res.ok || !res.body) {
          let msg = '请求失败(' + res.status + ')';
          try { const j = await res.json(); msg = (j.detail && (j.detail.message || j.detail)) || msg; } catch (e) {}
          throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
        }
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let buf = '';
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          let idx;
          while ((idx = buf.indexOf('\n\n')) !== -1) {
            const raw = buf.slice(0, idx).trim(); buf = buf.slice(idx + 2);
            if (!raw.startsWith('data:')) continue;
            const payload = raw.slice(5).trim();
            if (payload === '[DONE]') continue;
            try {
              const j = JSON.parse(payload);
              if (j.error) { ai.err = true; ai.text += (ai.text ? '\n' : '') + (j.error.message || '上游异常'); }
              const d = (j.choices && j.choices[0] && j.choices[0].delta) || {};
              if (d.content) { ai.text += d.content; this.scrollFlow(); }
            } catch (e) {}
          }
        }
      } catch (e) {
        ai.err = true;
        ai.text = ai.text || ('出错：' + (e.message || '网络异常'));
      }
      ai.stream = false;
      this.playBusy = false;
      this.scrollFlow();
    },
    scrollFlow() {
      this.$nextTick(() => {
        const f = this.$refs.flow;
        if (f) f.scrollTop = f.scrollHeight;
      });
    },
  },
};
</script>

<style scoped>
.gw-mask { position: fixed; inset: 0; z-index: 2400; background: rgba(15, 18, 34, .45); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; }
.gw-panel { position: relative; width: min(960px, 94vw); height: min(640px, 90vh); background: linear-gradient(160deg, #ffffff 0%, #f5f7ff 60%, #eef1fb 100%); border-radius: 20px; box-shadow: 0 24px 80px rgba(20, 24, 60, .35); overflow: hidden; display: flex; flex-direction: column; }
.gw-panel.is-full { width: 100vw; height: 100vh; border-radius: 0; }
.gw-aurora { position: absolute; inset: 0; pointer-events: none; opacity: .55; }
.gw-aurora i { position: absolute; border-radius: 50%; filter: blur(60px); }
.gw-aurora .a1 { width: 320px; height: 320px; left: -80px; top: -100px; background: rgba(122, 138, 255, .35); }
.gw-aurora .a2 { width: 280px; height: 280px; right: -60px; top: 30%; background: rgba(0, 200, 255, .22); }
.gw-aurora .a3 { width: 260px; height: 260px; left: 30%; bottom: -120px; background: rgba(255, 138, 216, .20); }

.gw-head { display: flex; align-items: center; gap: 12px; padding: 18px 20px 10px; position: relative; z-index: 1; }
.gw-face { width: 44px; height: 44px; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 14px rgba(30, 40, 90, .25); flex: none; }
.gw-name { font-weight: 800; font-size: 17px; color: #1c2140; display: flex; align-items: center; gap: 8px; }
.gw-badge { font-size: 10px; font-weight: 700; color: #4753d8; background: rgba(71, 83, 216, .12); border: 1px solid rgba(71, 83, 216, .25); padding: 1px 8px; border-radius: 99px; }
.gw-state { font-size: 12px; color: #6a7090; display: flex; align-items: center; gap: 6px; margin-top: 2px; }
.gw-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.gw-dot.ok { background: #2ec27e; box-shadow: 0 0 8px rgba(46, 194, 126, .8); }
.gw-dot.off { background: #c2a62e; box-shadow: 0 0 8px rgba(194, 166, 46, .7); }
.gw-hbtn { margin-left: auto; width: 32px; height: 32px; border-radius: 10px; border: none; background: rgba(28, 33, 64, .06); color: #3a4066; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.gw-hbtn:hover { background: rgba(28, 33, 64, .12); }
.gw-hbtn + .gw-hbtn { margin-left: 0; }

.gw-tabs { display: flex; gap: 6px; padding: 4px 20px 10px; position: relative; z-index: 1; }
.gw-tab { border: none; background: rgba(28, 33, 64, .05); color: #4a5070; font-size: 13px; padding: 7px 14px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all .2s; }
.gw-tab.on { background: #4753d8; color: #fff; box-shadow: 0 6px 16px rgba(71, 83, 216, .35); }

.gw-body { flex: 1; overflow-y: auto; padding: 4px 20px 20px; position: relative; z-index: 1; }
.gw-sec.play { display: flex; flex-direction: column; height: 100%; }
.gw-tip { font-size: 12.5px; color: #5a6080; background: rgba(71, 83, 216, .07); border: 1px dashed rgba(71, 83, 216, .3); border-radius: 12px; padding: 10px 12px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
.gw-code { background: rgba(28, 33, 64, .08); padding: 1px 6px; border-radius: 6px; font-size: 12px; color: #333a63; }
.gw-limit { font-size: 11px; color: #9095b0; margin: 6px 2px 12px; }
.gw-empty { text-align: center; color: #9095b0; font-size: 13px; padding: 26px 0; }
.gw-empty.big { display: flex; flex-direction: column; align-items: center; gap: 8px; margin-top: 12vh; }

.gw-newkey { display: flex; gap: 8px; }
.gw-input { flex: 1; border: 1.5px solid rgba(28, 33, 64, .14); background: rgba(255, 255, 255, .8); border-radius: 12px; padding: 10px 14px; font-size: 13.5px; color: #1c2140; outline: none; }
.gw-input:focus { border-color: #4753d8; box-shadow: 0 0 0 3px rgba(71, 83, 216, .15); }
.gw-btn { border: none; background: #4753d8; color: #fff; border-radius: 12px; padding: 10px 16px; font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; flex: none; transition: all .2s; }
.gw-btn:hover { background: #3a46c4; box-shadow: 0 6px 16px rgba(71, 83, 216, .4); }
.gw-btn:disabled { opacity: .6; cursor: not-allowed; }
.gw-btn.sm { padding: 6px 12px; border-radius: 9px; }
.gw-mini { border: none; background: rgba(28, 33, 64, .07); color: #4a5070; border-radius: 8px; padding: 5px 9px; font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }
.gw-mini:hover { background: rgba(28, 33, 64, .13); }
.gw-mini.danger { color: #d84a5f; background: rgba(216, 74, 95, .1); }
.gw-mini.danger:hover { background: rgba(216, 74, 95, .2); }

.gw-fresh { background: linear-gradient(135deg, #fff8e6, #fff3d6); border: 1.5px solid #f2c94c; border-radius: 14px; padding: 12px 14px; margin: 12px 0; }
.gw-fresh-t { font-size: 12.5px; font-weight: 700; color: #8a6d1a; display: flex; gap: 6px; align-items: center; margin-bottom: 8px; }
.gw-fresh-k { display: flex; align-items: center; gap: 10px; }
.gw-fresh-k code { flex: 1; background: rgba(255, 255, 255, .9); border-radius: 8px; padding: 8px 10px; font-size: 13px; word-break: break-all; color: #4a3d10; }

.gw-keycard { display: flex; align-items: center; justify-content: space-between; background: rgba(255, 255, 255, .85); border: 1px solid rgba(28, 33, 64, .08); border-radius: 14px; padding: 12px 14px; margin-bottom: 8px; box-shadow: 0 2px 10px rgba(28, 33, 64, .05); }
.gw-key-name { font-size: 14px; font-weight: 700; color: #1c2140; display: flex; align-items: center; gap: 6px; }
.gw-key-name .dim { opacity: .4; }
.gw-key-prefix { font-size: 11px; color: #6a7090; background: rgba(28, 33, 64, .06); border-radius: 6px; padding: 1px 6px; font-weight: 400; }
.gw-key-meta { font-size: 11.5px; color: #8b90ac; margin-top: 4px; }
.gw-key-r { display: flex; gap: 6px; }

.gw-models { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 10px; }
.gw-model { display: flex; align-items: center; gap: 10px; background: rgba(255, 255, 255, .85); border: 1px solid rgba(28, 33, 64, .08); border-radius: 14px; padding: 12px; box-shadow: 0 2px 10px rgba(28, 33, 64, .05); }
.gw-model-ico { width: 38px; height: 38px; border-radius: 12px; background: linear-gradient(135deg, #e8ebff, #dff4ff); color: #4753d8; display: flex; align-items: center; justify-content: center; flex: none; }
.gw-model-main { flex: 1; min-width: 0; }
.gw-model-id { font-size: 13.5px; font-weight: 700; color: #1c2140; word-break: break-all; }
.gw-model-up { font-size: 11px; color: #8b90ac; margin-top: 2px; }

.gw-play-head { display: flex; gap: 8px; align-items: center; margin-bottom: 10px; }
.gw-select { flex: 1; border: 1.5px solid rgba(28, 33, 64, .14); background: rgba(255, 255, 255, .85); border-radius: 12px; padding: 9px 12px; font-size: 13px; color: #1c2140; outline: none; }
.gw-flow { flex: 1; overflow-y: auto; min-height: 200px; padding: 6px 2px; }
.gw-msg { display: flex; margin-bottom: 10px; }
.gw-msg.user { justify-content: flex-end; }
.gw-bub { max-width: 78%; background: #fff; border: 1px solid rgba(28, 33, 64, .08); color: #1c2140; border-radius: 14px; padding: 9px 13px; font-size: 13.5px; line-height: 1.6; box-shadow: 0 2px 8px rgba(28, 33, 64, .06); white-space: pre-wrap; word-break: break-word; }
.gw-msg.user .gw-bub { background: #4753d8; color: #fff; border: none; }
.gw-bub.err { background: #fff2f4; border-color: rgba(216, 74, 95, .4); color: #b8324a; }
.gw-caret { display: inline-block; width: 7px; height: 14px; background: #4753d8; margin-left: 2px; vertical-align: -2px; animation: gw-blink 1s steps(2) infinite; }
@keyframes gw-blink { 0% { opacity: 1; } 50% { opacity: 0; } }
.gw-inputrow { display: flex; gap: 8px; padding-top: 8px; }

.gw-fade-enter-active, .gw-fade-leave-active { transition: opacity .22s ease; }
.gw-fade-enter-active .gw-panel, .gw-fade-leave-active .gw-panel { transition: transform .25s cubic-bezier(.2, .9, .3, 1.2); }
.gw-fade-enter-from, .gw-fade-leave-to { opacity: 0; }
.gw-fade-enter-from .gw-panel, .gw-fade-leave-to .gw-panel { transform: translateY(26px) scale(.97); }
.gw-pop-enter-active { transition: all .25s ease; }
.gw-pop-enter-from { opacity: 0; transform: translateY(8px); }
</style>
