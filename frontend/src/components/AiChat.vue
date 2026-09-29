<template>
  <div>
    <!-- 常显胶囊入口：文字+图标，一眼可见 -->
    <button class="ai-fab" :class="{ 'is-open': open, 'is-off': !status.enabled }" @click="toggle">
      <span class="ai-fab-halo"></span>
      <v-icon size="19" class="ai-fab-ico">mdi-creation</v-icon>
      <span class="ai-fab-txt">AI 分身</span>
      <span class="ai-fab-badge" v-if="!status.enabled">待配置</span>
    </button>

    <!-- 侧滑抽屉（白色主题） -->
    <transition name="ai-slide">
      <aside v-if="open" class="ai-panel" :class="{ 'is-full': xs, 'is-thinking': busy }">
        <div class="ai-aurora"><i class="a1"></i><i class="a2"></i><i class="a3"></i></div>
        <div v-if="busy" class="ai-scan"></div>

        <header class="ai-head">
          <div class="ai-face">
            <v-img :src="avatar" cover />
            <span class="ai-face-ring" :class="{ spin: busy }"></span>
          </div>
          <div class="ai-who">
            <div class="ai-name">{{ status.name }}<span class="ai-badge">AI</span></div>
            <div class="ai-state"><i :class="['ai-dot', stateCls]"></i>{{ stateText }}</div>
          </div>
          <button class="ai-hbtn" title="新对话" @click="reset"><v-icon size="16">mdi-refresh</v-icon></button>
          <button class="ai-hbtn" title="收起" @click="open = false"><v-icon size="16">mdi-chevron-right</v-icon></button>
        </header>

        <!-- 模型选择 -->
        <div class="ai-models">
          <button v-for="m in models" :key="m.id"
                  :class="['ai-mbtn', { on: model === m.id, off: !m.enabled }]"
                  :title="m.enabled ? m.desc : '站长还没配置这个模型的接口'"
                  @click="pickModel(m)">
            <v-icon size="14">{{ m.icon }}</v-icon>{{ m.label }}
            <v-icon v-if="!m.enabled" size="11" class="ai-mlock">mdi-lock-outline</v-icon>
          </button>
        </div>

        <div class="ai-flow" ref="flow">
          <div v-if="!msgs.length" class="ai-hello">
            <p class="ai-hi">{{ typed }}<span v-if="typing" class="ai-caret"></span></p>
            <div class="ai-chips">
              <button v-for="c in chips" :key="c" @click="send(c)">
                <span class="chip-ico">✦</span>{{ c }}
              </button>
            </div>
          </div>

          <transition-group name="ai-pop" tag="div">
            <div v-for="(m, i) in msgs" :key="i" :class="['ai-msg', m.role]">
              <div class="ai-ava" v-if="m.role === 'assistant'">
                <v-img :src="avatar" cover />
                <span class="ai-ava-glow"></span>
              </div>
              <div class="ai-bub" :class="{ 'ai-bub-err': m.err }">
                <span class="ai-txt">{{ m.text }}</span>
                <span v-if="m.stream" class="ai-caret"></span>
              </div>
            </div>
          </transition-group>

          <div v-if="busy && !streaming" class="ai-msg assistant">
            <div class="ai-ava"><v-img :src="avatar" cover /><span class="ai-ava-glow"></span></div>
            <div class="ai-bub ai-typing"><i></i><i></i><i></i></div>
          </div>
        </div>

        <footer class="ai-input" :class="{ 'is-focus': inputFocus }">
          <textarea ref="ta" v-model="draft" rows="1" :placeholder="ph"
                    @keydown.enter.exact.prevent="send()" @input="autogrow"
                    @focus="inputFocus = true" @blur="inputFocus = false"></textarea>
          <button class="ai-send" :disabled="!draft.trim() || busy" @click="send()">
            <v-icon size="16" :class="{ 'mdi-spin': busy }">{{ busy ? 'mdi-loading' : 'mdi-arrow-up' }}</v-icon>
          </button>
        </footer>
      </aside>
    </transition>
  </div>
</template>

<script>
import { useDisplay } from 'vuetify';

export default {
  name: 'AiChat',
  props: { avatar: { type: String, default: '/img/avatar.webp' } },
  setup() {
    const { xs } = useDisplay();
    return { xs };
  },
  data() {
    return {
      open: false,
      msgs: [],
      draft: '',
      busy: false,
      streaming: false,
      inputFocus: false,
      sessionId: '',
      context: '',
      model: 'doubao',
      models: [
        { id: 'doubao', label: '豆包', icon: 'mdi-leaf', enabled: false, desc: '豆包大模型' },
      ],
      status: { enabled: false, name: '越的分身' },
      typed: '',
      typing: false,
      chips: ['这个网站能做什么？', '叶片发黄怎么办？', '校园跑跑不完怎么办？', '网课太多刷不完？'],
      _abort: null, _t: null,
    };
  },
  computed: {
    curModel() { return this.models.find((m) => m.id === this.model) || {}; },
    stateCls() {
      if (!this.curModel.enabled) return 'off';
      return this.busy ? 'think' : 'on';
    },
    stateText() {
      if (!this.curModel.enabled) return `「${this.curModel.label}」还没接线`;
      return this.busy ? '正在想…' : '在线';
    },
    ph() {
      return this.curModel.enabled ? `向${this.curModel.label}说点什么…（Enter 发送）` : `「${this.curModel.label}」待站长配置接口`;
    },
  },
  async mounted() {
    try { this.sessionId = localStorage.getItem('wb_ai_sid') || ''; } catch (e) {}
    try {
      const r = await fetch('/api/ai/status');
      if (r.ok) {
        const j = await r.json();
        this.status = j;
        if (Array.isArray(j.models)) {
          for (const srv of j.models) {
            const m = this.models.find((x) => x.id === srv.id);
            if (m) m.enabled = !!srv.enabled;
          }
          const firstOn = this.models.find((m) => m.enabled);
          if (firstOn) this.model = firstOn.id;
        }
      }
    } catch (e) { /* 保持默认 */ }
  },
  methods: {
    pickModel(m) {
      if (!m.enabled) {
        this.msgs.push({ role: 'assistant', text: `「${m.label}」的接口还没配置。站长在服务器 .env 里填好 Key 就能用啦。`, err: true });
        return;
      }
      this.model = m.id;
    },
    toggle() {
      this.open = !this.open;
      if (this.open) {
        this.typeHello();
        this.$nextTick(() => this.$refs.ta?.focus());
      } else this.stopStream();
    },
    /** 供其它页面调用：带着场景上下文打开（如病害诊断结果追问） */
    openWith({ context = '', preset = '', autoSend = false } = {}) {
      this.context = context;
      this.open = true;
      this.typeHello();
      if (preset) {
        this.draft = preset;
        if (autoSend) this.$nextTick(() => this.send());
      } else this.$nextTick(() => this.$refs.ta?.focus());
    },
    typeHello() {
      if (this.typed || this.msgs.length) return;
      const full = this.context
        ? `关于「${this.context.slice(0, 18)}」，想了解什么？`
        : '我是越的分身豆包，在校大二学生，一位学习者。站里的功能、叶片病害、代码都可以问我～';
      this.typing = true;
      let i = 0;
      clearInterval(this._t);
      this._t = setInterval(() => {
        this.typed = full.slice(0, ++i);
        if (i >= full.length) { clearInterval(this._t); this.typing = false; }
      }, 34);
    },
    autogrow() {
      const t = this.$refs.ta;
      if (!t) return;
      t.style.height = 'auto';
      t.style.height = Math.min(t.scrollHeight, 96) + 'px';
    },
    scroll() {
      this.$nextTick(() => {
        const f = this.$refs.flow;
        if (f) f.scrollTop = f.scrollHeight;
      });
    },
    stopStream() { try { this._abort?.abort(); } catch (e) {} this.busy = false; this.streaming = false; },
    onLogout() {
      try {
        const u = JSON.parse(localStorage.getItem('disease_user') || 'null');
        if (u && u.id) this.sessionId = 'u' + u.id;
      } catch (e) {}
      this.reset();
    },

    reset() {
      this.stopStream();
      this.msgs = []; this.typed = ''; this.context = '';
      if (this.sessionId) {
        fetch('/api/ai/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id: this.sessionId }) }).catch(() => {});
      }
      this.sessionId = '';
      try { localStorage.removeItem('wb_ai_sid'); } catch (e) {}
    },

    async send(text) {
      try {
        const u = JSON.parse(localStorage.getItem('disease_user') || 'null');
        if (u && u.id) this.sessionId = 'u' + u.id;  // 一账号一会话
      } catch (e) {}
      const content = (text ?? this.draft).trim();
      if (!content || this.busy) return;
      if (!this.curModel.enabled) {
        this.msgs.push({ role: 'assistant', text: `「${this.curModel.label}」还没接线：站长需要在服务器 .env 里配置这个模型的接口地址和密钥。`, err: true });
        this.scroll();
        return;
      }
      this.draft = '';
      this.$nextTick(() => this.autogrow());
      this.msgs.push({ role: 'user', text: content });
      const aiMsg = { role: 'assistant', text: '', stream: true, err: false };
      this.msgs.push(aiMsg);
      this.busy = true; this.streaming = true;
      this.scroll();

      const token = localStorage.getItem('disease_token') || '';
      this._abort = new AbortController();
      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: 'Bearer ' + token } : {}),
          },
          body: JSON.stringify({ message: content, session_id: this.sessionId, context: this.context, model: this.model }),
          signal: this._abort.signal,
        });
        if (!res.ok || !res.body) {
          let msg = '分身暂时联系不上，稍后再试';
          try {
            const j = await res.json();
            msg = j?.detail?.message || j?.detail || msg;
            if (typeof msg !== 'string') msg = '分身暂时联系不上，稍后再试';
          } catch (e) {}
          aiMsg.text = msg; aiMsg.err = true; aiMsg.stream = false;
          this.busy = false; this.streaming = false;
          this.scroll();
          return;
        }
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let buf = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          const parts = buf.split('\n\n');
          buf = parts.pop() || '';
          for (const p of parts) {
            const line = p.trim();
            if (!line.startsWith('data:')) continue;
            let ev;
            try { ev = JSON.parse(line.slice(5).trim()); } catch (e) { continue; }
            if (ev.type === 'delta') { aiMsg.text += ev.text; this.scroll(); }
            else if (ev.type === 'error') { aiMsg.text = ev.message; aiMsg.err = true; }
            else if (ev.type === 'done') {
              if (ev.session_id) {
                this.sessionId = ev.session_id;
                try { localStorage.setItem('wb_ai_sid', ev.session_id); } catch (e) {}
              }
            }
          }
        }
      } catch (e) {
        if (e?.name !== 'AbortError') { aiMsg.text = '网络开小差了，再试一次？'; aiMsg.err = true; }
      } finally {
        aiMsg.stream = false;
        this.busy = false; this.streaming = false;
        this.scroll();
      }
    },
  },
  beforeUnmount() { clearInterval(this._t); this.stopStream(); },
};
</script>

<style scoped>
/* ============ 常显胶囊入口 ============ */
.ai-fab {
  position: fixed; right: 20px; bottom: 34px; z-index: 60;
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 18px; border: none; border-radius: 27px; cursor: pointer;
  color: #fff; font-size: 14px; font-weight: 700; letter-spacing: .5px;
  background: linear-gradient(120deg, #1b5e20, #2e7d32 45%, #00897b);
  box-shadow: 0 10px 30px rgba(27,94,32,.45), 0 0 0 1px rgba(255,255,255,.22) inset;
  transition: transform .28s cubic-bezier(.2,.8,.2,1), box-shadow .28s ease;
  animation: fab-breathe 3.4s ease-in-out infinite;
}
@keyframes fab-breathe {
  0%, 100% { box-shadow: 0 10px 30px rgba(27,94,32,.45), 0 0 0 0 rgba(102,187,106,.5); }
  50%      { box-shadow: 0 12px 36px rgba(27,94,32,.6), 0 0 0 10px rgba(102,187,106,0); }
}
.ai-fab:hover { transform: translateY(-3px) scale(1.04); }
.ai-fab.is-open { transform: scale(.98); }
.ai-fab-halo {
  position: absolute; inset: -4px; border-radius: 30px; pointer-events: none;
  background: conic-gradient(from 0deg, #66bb6a, #26c6da, #7c4dff, #66bb6a);
  filter: blur(14px); opacity: .55; z-index: -1;
  animation: halo-spin 5s linear infinite;
}
@keyframes halo-spin { to { transform: rotate(360deg); } }
.ai-fab-ico { color: #dcedc8; }
.ai-fab.is-off { background: linear-gradient(120deg, #546e7a, #78909c); }
.ai-fab-badge {
  font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 8px;
  background: rgba(255,255,255,.22); letter-spacing: 0;
}

/* ============ 白色主题抽屉 ============ */
.ai-slide-enter-active, .ai-slide-leave-active { transition: transform .42s cubic-bezier(.22,.9,.24,1), opacity .32s ease; }
.ai-slide-enter-from, .ai-slide-leave-to { transform: translateX(106%); opacity: .35; }
.ai-panel {
  position: fixed; top: 0; right: 0; bottom: 0; width: 430px; z-index: 2300;
  display: flex; flex-direction: column;
  background: rgba(250,252,250,.97);
  backdrop-filter: blur(24px) saturate(1.2);
  border-left: 1px solid rgba(46,125,50,.14);
  box-shadow: -30px 0 80px rgba(30,60,30,.18);
  color: #1a2e1a; overflow: hidden;
}
.ai-panel.is-full { width: 100%; }
.ai-panel.is-thinking { animation: ai-glow 2.2s ease-in-out infinite; }
@keyframes ai-glow {
  0%,100% { box-shadow: -30px 0 80px rgba(30,60,30,.18), -2px 0 24px rgba(102,187,106,.2); }
  50%     { box-shadow: -30px 0 80px rgba(30,60,30,.18), -4px 0 40px rgba(102,187,106,.45); }
}

/* 淡色极光 */
.ai-aurora { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.ai-aurora i { position: absolute; border-radius: 50%; filter: blur(80px); opacity: .16; }
.ai-aurora .a1 { width: 380px; height: 380px; left: -120px; top: -100px; background: #66bb6a; animation: aurora1 14s ease-in-out infinite alternate; }
.ai-aurora .a2 { width: 300px; height: 300px; right: -90px; top: 30%; background: #26c6da; animation: aurora2 18s ease-in-out infinite alternate; }
.ai-aurora .a3 { width: 320px; height: 320px; left: 20%; bottom: -140px; background: #7c4dff; opacity: .1; animation: aurora1 22s ease-in-out infinite alternate-reverse; }
@keyframes aurora1 { to { transform: translate(60px, 46px) scale(1.14); } }
@keyframes aurora2 { to { transform: translate(-50px, -40px) scale(1.1); } }
.ai-scan {
  position: absolute; top: 0; left: 0; right: 0; height: 2.5px; z-index: 5;
  background: linear-gradient(90deg, transparent, #43a047, #26c6da, transparent);
  background-size: 40% 100%; background-repeat: no-repeat;
  animation: ai-scan 1.6s ease-in-out infinite;
}
@keyframes ai-scan { 0% { background-position: -40% 0; } 100% { background-position: 140% 0; } }

/* 顶栏 */
.ai-head {
  position: relative; z-index: 2;
  display: flex; align-items: center; gap: 11px;
  padding: 14px 16px 12px;
  border-bottom: 1px solid rgba(46,125,50,.1);
}
.ai-face {
  position: relative; width: 42px; height: 42px; border-radius: 14px; overflow: hidden; flex: none;
  box-shadow: 0 4px 14px rgba(46,125,50,.25), 0 0 0 1px rgba(46,125,50,.15);
}
.ai-face-ring { position: absolute; inset: -3px; border-radius: 16px; border: 2px solid transparent; pointer-events: none; }
.ai-face-ring.spin { border-top-color: #43a047; border-right-color: #26c6da; animation: ai-ring 1.1s linear infinite; }
@keyframes ai-ring { to { transform: rotate(360deg); } }
.ai-who { flex: 1; min-width: 0; }
.ai-name { font-size: 14.5px; font-weight: 800; color: #14301a; display: flex; align-items: center; gap: 6px; }
.ai-badge {
  font-size: 9px; font-weight: 800; letter-spacing: 1px; padding: 2px 6px; border-radius: 6px;
  background: linear-gradient(135deg, #00897b, #26c6da); color: #fff;
}
.ai-state { font-size: 11.5px; color: #6b8f73; display: flex; align-items: center; gap: 5px; margin-top: 2px; }
.ai-dot { width: 6px; height: 6px; border-radius: 50%; background: #43a047; box-shadow: 0 0 7px rgba(67,160,71,.8); }
.ai-dot.think { background: #00acc1; box-shadow: 0 0 8px #00acc1; animation: ai-blink 1s ease-in-out infinite; }
.ai-dot.off { background: #b0bec5; box-shadow: none; }
@keyframes ai-blink { 50% { opacity: .3; } }
.ai-hbtn {
  width: 31px; height: 31px; border-radius: 10px; flex: none;
  background: #fff; border: 1px solid rgba(46,125,50,.16);
  color: #2e7d32; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .2s ease, transform .2s ease;
}
.ai-hbtn:hover { background: #e8f5e9; transform: translateY(-1px); }

/* 模型选择 */
.ai-models {
  position: relative; z-index: 2;
  display: flex; gap: 8px; padding: 10px 16px 8px;
  border-bottom: 1px solid rgba(46,125,50,.08);
}
.ai-mbtn {
  flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  padding: 8px 6px; border-radius: 12px; cursor: pointer;
  font-size: 12.5px; font-weight: 700; color: #4b6a52;
  background: #fff; border: 1.5px solid rgba(46,125,50,.18);
  transition: all .22s cubic-bezier(.2,.8,.2,1);
}
.ai-mbtn:hover { border-color: rgba(46,125,50,.4); transform: translateY(-1px); }
.ai-mbtn.on {
  color: #fff; border-color: transparent;
  background: linear-gradient(120deg, #2e7d32, #00897b);
  box-shadow: 0 6px 16px rgba(46,125,50,.3);
}
.ai-mbtn.off { opacity: .62; }
.ai-mlock { opacity: .7; }

/* 消息区 */
.ai-flow { flex: 1; overflow-y: auto; padding: 18px 16px; position: relative; z-index: 2; }
.ai-flow::-webkit-scrollbar { width: 4px; }
.ai-flow::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #66bb6a, #26c6da); border-radius: 3px; }
.ai-hello { padding: 4px 2px 14px; }
.ai-hi { font-size: 14.5px; line-height: 1.8; color: #24422c; min-height: 28px; margin: 0 0 16px; }
.ai-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.ai-chips button {
  font-size: 12px; padding: 8px 13px; border-radius: 13px; cursor: pointer;
  display: inline-flex; align-items: center; gap: 5px;
  background: #fff; border: 1.5px solid rgba(46,125,50,.2);
  color: #2e5e3a; transition: all .24s cubic-bezier(.2,.8,.2,1);
}
.ai-chips .chip-ico { color: #43a047; font-size: 11px; }
.ai-chips button:hover { border-color: #43a047; transform: translateY(-2px); box-shadow: 0 8px 18px rgba(67,160,71,.16); }

.ai-pop-enter-active { transition: all .34s cubic-bezier(.2,.9,.24,1); }
.ai-pop-enter-from { opacity: 0; transform: translateY(10px) scale(.97); }
.ai-msg { display: flex; margin-bottom: 13px; align-items: flex-end; }
.ai-msg.user { justify-content: flex-end; }
.ai-ava {
  position: relative; width: 30px; height: 30px; border-radius: 10px; overflow: hidden;
  flex: none; margin-right: 9px; margin-bottom: 2px;
  box-shadow: 0 0 0 1px rgba(46,125,50,.2);
}
.ai-ava-glow { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(circle at 30% 20%, rgba(102,187,106,.35), transparent 65%); }
.ai-msg.user .ai-ava { display: none; }
.ai-bub {
  position: relative; max-width: 80%; padding: 10px 14px;
  font-size: 13.5px; line-height: 1.7; word-break: break-word; white-space: pre-wrap;
  color: #22382a;
}
.ai-msg.assistant .ai-bub {
  background: #fff;
  border: 1px solid rgba(46,125,50,.14);
  border-radius: 4px 16px 16px 16px;
  box-shadow: 0 4px 16px rgba(46,125,50,.1);
}
.ai-msg.user .ai-bub {
  background: linear-gradient(135deg, #2e7d32 0%, #43a047 60%, #66bb6a 100%);
  color: #fff;
  border-radius: 16px 4px 16px 16px;
  box-shadow: 0 8px 22px rgba(46,125,50,.32);
}
.ai-bub-err { background: #fff4f2 !important; border-color: rgba(244,67,54,.3) !important; color: #c0563e !important; }
.ai-caret {
  display: inline-block; width: 3px; height: 14px; margin-left: 3px; border-radius: 2px;
  background: linear-gradient(180deg, #43a047, #26c6da);
  vertical-align: -2px; animation: ai-caret .85s step-end infinite;
}
@keyframes ai-caret { 50% { opacity: 0; } }
.ai-typing { display: flex; gap: 5px; align-items: center; padding: 13px 15px; }
.ai-typing i {
  width: 6px; height: 6px; border-radius: 50%;
  background: linear-gradient(135deg, #43a047, #26c6da);
  animation: ai-dotjump 1.2s ease-in-out infinite;
}
.ai-typing i:nth-child(2) { animation-delay: .16s; }
.ai-typing i:nth-child(3) { animation-delay: .32s; }
@keyframes ai-dotjump { 0%,60%,100% { transform: translateY(0); opacity: .45; } 30% { transform: translateY(-5px); opacity: 1; } }

/* 输入区 */
.ai-input {
  position: relative; z-index: 2;
  display: flex; align-items: flex-end; gap: 9px;
  padding: 12px 14px 14px;
  border-top: 1px solid rgba(46,125,50,.1);
  background: rgba(255,255,255,.75);
}
.ai-input textarea {
  flex: 1; resize: none; max-height: 96px; min-height: 40px;
  padding: 11px 14px; border-radius: 14px;
  background: #fff; border: 1.5px solid rgba(46,125,50,.2);
  color: #1a2e1a; font-size: 13.5px; line-height: 1.55; font-family: inherit;
  outline: none;
  transition: border-color .25s ease, box-shadow .25s ease;
}
.ai-input.is-focus textarea {
  border-color: #43a047;
  box-shadow: 0 0 0 3px rgba(67,160,71,.16), 0 0 20px rgba(67,160,71,.12);
}
.ai-input textarea::placeholder { color: #9db8a4; }
.ai-send {
  width: 40px; height: 40px; flex: none; border-radius: 13px; border: none; cursor: pointer;
  background: linear-gradient(135deg, #2e7d32, #43a047); color: #fff;
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
  box-shadow: 0 8px 22px rgba(46,125,50,.36);
  transition: transform .22s cubic-bezier(.2,.8,.2,1), opacity .2s ease;
}
.ai-send::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,.4) 48%, transparent 62%);
  background-size: 240% 100%;
  animation: ai-shimmer 3.2s ease-in-out infinite;
}
@keyframes ai-shimmer { 0%, 60% { background-position: 180% 0; } 100% { background-position: -80% 0; } }
.ai-send:hover:not(:disabled) { transform: translateY(-2px) scale(1.06); }
.ai-send:disabled { opacity: .4; cursor: not-allowed; box-shadow: none; }
.ai-send:disabled::after { display: none; }

@media (max-width: 820px) {
  .ai-fab { right: 14px; bottom: 26px; padding: 11px 15px; font-size: 13px; }
  .ai-flow { padding: 14px 12px; }
}
</style>
