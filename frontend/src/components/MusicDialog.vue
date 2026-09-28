<template>
  <v-dialog v-model="visible" :width="xs ? '100%' : 420" :fullscreen="xs" :scrim="true"
            transition="dialog-bottom-transition" content-class="music-dialog-wrap">
    <v-card class="mp" :class="{ 'is-playing': playing }" rounded="0" :style="themeVars">

      <!-- 背景：封面模糊 + 主题色 mesh 光晕 + 渐隐遮罩 -->
      <div class="mp-bg" :style="bgStyle"></div>
      <div class="mp-glow" ref="glowEl"></div>
      <div class="mp-mask"></div>

      <!-- 顶栏（毛玻璃胶囊） -->
      <div class="mp-top">
        <button class="mp-round" @click="closePlayer"><v-icon size="21">mdi-chevron-down</v-icon></button>
        <div class="mp-top-label">{{ playing ? '正在播放' : '音乐' }}</div>
        <button class="mp-round" @click="showQueue = !showQueue">
          <v-icon size="21">mdi-playlist-music</v-icon>
        </button>
      </div>

      <!-- 主区：封面 / 歌词 -->
      <div class="mp-stage" @click="showLyrics = !showLyrics">
        <div class="mp-cover-wrap" :class="{ 'is-hidden': showLyrics }">
          <div class="mp-halo" ref="haloEl"></div>
          <div class="mp-cover" ref="coverEl">
            <v-img :src="current?.pic" cover class="mp-cover-img">
              <template #placeholder><div class="mp-cover-ph">♪</div></template>
            </v-img>
            <div class="mp-cover-sheen"></div>
          </div>
        </div>

        <div class="mp-lyrics" :class="{ 'is-show': showLyrics }" ref="lyricBox">
          <div v-if="fullLyrics.length === 0" class="mp-ly-line active">
            <span class="mp-ly-text" style="color:rgba(255,255,255,.8)">♪ 纯音乐，请欣赏 ♪</span>
          </div>
          <template v-else>
            <div v-for="l in visibleLyrics" :key="l.idx"
                 :class="['mp-ly-line', { active: l.idx === lyricIdx, dim: l.idx < lyricIdx, next: l.idx > lyricIdx }]">
              <span class="mp-ly-text" :style="l.idx === lyricIdx ? karaokeStyle(l) : null">{{ l.text || '·' }}</span>
            </div>
          </template>
        </div>
      </div>

      <!-- 曲目信息（精致排印） -->
      <div class="mp-meta">
        <div class="mp-title">{{ current?.title || '未选择歌曲' }}</div>
        <div class="mp-artist">{{ current?.author || '—' }}</div>
      </div>

      <!-- 频谱（上下对称镜像 + 峰值保持） -->
      <canvas ref="vizCanvas" class="mp-viz" height="76"></canvas>

      <!-- 进度 -->
      <div class="mp-progress">
        <v-slider v-model="sliderVal" :max="100" hide-details thumb-size="11" color="white"
                  track-color="rgba(255,255,255,0.18)" track-size="2"
                  @start="_dragging = true" @end="_dragging = false; $emit('seek', sliderVal)" />
        <div class="mp-times"><span>{{ fmt(currentTime) }}</span><span>{{ fmt(duration) }}</span></div>
      </div>

      <!-- 控制 -->
      <div class="mp-controls">
        <button class="mp-cbtn" @click="cycleMode" :title="modeLabel"><v-icon size="20">{{ modeIcon }}</v-icon></button>
        <button class="mp-cbtn" @click.stop="$emit('prev')"><v-icon size="30">mdi-skip-previous</v-icon></button>
        <button class="mp-play" @click.stop="onToggle">
          <span class="mp-play-ring"></span>
          <v-icon size="34">{{ playing ? 'mdi-pause' : 'mdi-play' }}</v-icon>
        </button>
        <button class="mp-cbtn" @click.stop="$emit('next')"><v-icon size="30">mdi-skip-next</v-icon></button>
        <button class="mp-cbtn" @click.stop="showQueue = !showQueue"><v-icon size="20">mdi-format-list-bulleted</v-icon></button>
      </div>

      <!-- 队列 / 搜歌 -->
      <v-expand-transition>
        <div v-show="showQueue" class="mp-sheet">
          <div class="mp-handle"></div>
          <div class="mp-qtabs">
            <button :class="['mp-qtab', { on: qtab === 'queue' }]" @click="qtab = 'queue'">
              <v-icon size="15" class="mr-1">mdi-playlist-play</v-icon>播放队列
            </button>
            <button :class="['mp-qtab', { on: qtab === 'search' }]" @click="qtab = 'search'">
              <v-icon size="15" class="mr-1">mdi-magnify</v-icon>在线搜歌
            </button>
          </div>

          <div v-if="qtab === 'queue'" class="mp-qbody">
            <v-text-field v-model="search" placeholder="在队列中筛选" variant="solo-filled" density="compact"
                          hide-details prepend-inner-icon="mdi-magnify" clearable flat
                          bg-color="rgba(255,255,255,0.10)" class="mp-qsearch" />
            <div class="mp-qlist">
              <div v-for="s in filteredSongs" :key="s.idx"
                   :class="['mp-qitem', { now: s.idx === currentIndex }]" @click="$emit('play', s.idx)">
                <span class="mp-qi-idx">
                  <v-icon v-if="s.idx === currentIndex" size="14">mdi-volume-high</v-icon>
                  <template v-else>{{ s.idx + 1 }}</template>
                </span>
                <span class="mp-qi-t">{{ s.title }}</span>
                <span class="mp-qi-a">{{ s.author }}</span>
              </div>
            </div>
          </div>

          <div v-else class="mp-qbody">
            <div class="mp-sbar">
              <v-text-field v-model="onlineKw" placeholder="搜歌名 / 歌手，全网曲库" variant="solo-filled" density="compact"
                            hide-details prepend-inner-icon="mdi-music-search" clearable flat
                            bg-color="rgba(255,255,255,0.10)" class="mp-qsearch"
                            @keyup.enter="doOnlineSearch" />
              <v-btn class="mp-sgo" :loading="onlineLoading" icon size="small" variant="flat"
                     color="green-darken-1" @click="doOnlineSearch">
                <v-icon size="18">mdi-magnify</v-icon>
              </v-btn>
            </div>
            <div v-if="onlineError" class="mp-serr"><v-icon size="13">mdi-alert-circle-outline</v-icon> {{ onlineError }}</div>
            <div class="mp-qlist">
              <div v-if="onlineLoading && !onlineResults.length" class="mp-shint">正在搜索…</div>
              <div v-else-if="!onlineResults.length && onlineSearched" class="mp-shint">没有找到相关歌曲</div>
              <div v-else-if="!onlineResults.length" class="mp-shint">
                输入关键词即可搜索<b>全网歌曲</b><br />
                <span class="mp-shint-sub">登录后可搜可听 · VIP 歌曲视音源而定</span>
              </div>
              <div v-for="s in onlineResults" :key="s.id"
                   :class="['mp-oitem', { pending: pendingId === s.id }]" @click="pickOnline(s)">
                <div class="mp-ocover"><v-img :src="s.pic" cover /></div>
                <div class="mp-ometa">
                  <div class="mp-ot">{{ s.name }} <span v-if="s.fee === 1" class="mp-vip">VIP</span></div>
                  <div class="mp-oa">{{ s.artist }}</div>
                </div>
                <span class="mp-odur">{{ fmtDur(s.duration) }}</span>
                <v-icon v-if="pendingId === s.id" size="15" class="mdi-spin">mdi-loading</v-icon>
                <v-icon v-else size="15" class="mp-oplay">mdi-play-circle-outline</v-icon>
              </div>
            </div>
          </div>
        </div>
      </v-expand-transition>
    </v-card>
  </v-dialog>
</template>

<script>
import api from '../services/api.js';
import { useDisplay } from 'vuetify';

function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
function hex(r, g, b) { return '#' + [r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join(''); }
function lighten(r, g, b, k) { return hex(r + (255 - r) * k, g + (255 - g) * k, b + (255 - b) * k); }
function roundRect(c, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + rr, y);
  c.lineTo(x + w - rr, y);
  c.quadraticCurveTo(x + w, y, x + w, y + rr);
  c.lineTo(x + w, y + h - rr);
  c.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  c.lineTo(x + rr, y + h);
  c.quadraticCurveTo(x, y + h, x, y + h - rr);
  c.lineTo(x, y + rr);
  c.quadraticCurveTo(x, y, x + rr, y);
  c.closePath();
}

export default {
  name: 'MusicDialog',
  props: { musicinfo: Array, currentIndex: Number, playing: Boolean, progress: Number, currentLyric: String, currentTime: Number, duration: Number },
  emits: ['prev', 'toggle', 'next', 'play', 'seek', 'playonline', 'mode'],
  setup() {
    const { xs } = useDisplay();
    return { xs };
  },
  data() {
    return {
      visible: false, search: '', sliderVal: 0, _dragging: false,
      fullLyrics: [], lyricIdx: -1,
      showLyrics: false, showQueue: false, qtab: 'queue',
      mode: 'order',
      onlineKw: '', onlineLoading: false, onlineResults: [], onlineSearched: false, onlineError: '', pendingId: null,
      accent: '#66bb6a', accent2: '#2e7d32', accentLight: '#a5d6a7',
      _raf: 0, _graph: null,
    };
  },
  computed: {
    current() { return this.musicinfo?.[this.currentIndex]; },
    bgStyle() { const pic = this.current?.pic; return pic ? { backgroundImage: `url("${pic}")` } : {}; },
    themeVars() { return { '--mp-a1': this.accent, '--mp-a2': this.accent2, '--mp-a3': this.accentLight }; },
    modeIcon() { return this.mode === 'single' ? 'mdi-repeat-once' : this.mode === 'random' ? 'mdi-shuffle' : 'mdi-repeat'; },
    modeLabel() { return this.mode === 'single' ? '单曲循环' : this.mode === 'random' ? '随机播放' : '列表循环'; },
    filteredSongs() {
      const q = this.search.toLowerCase().trim();
      const arr = (this.musicinfo || []).map((s, i) => ({ ...s, idx: i }));
      return q ? arr.filter((s) => (s.title || '').toLowerCase().includes(q) || (s.author || '').toLowerCase().includes(q)) : arr;
    },
    visibleLyrics() {
      if (!this.fullLyrics.length) return [];
      const win = this.xs ? 5 : 7, half = Math.floor(win / 2);
      let start = Math.max(0, (this.lyricIdx >= 0 ? this.lyricIdx : 0) - half);
      const end = Math.min(this.fullLyrics.length, start + win);
      if (end - start < win) start = Math.max(0, end - win);
      return this.fullLyrics.slice(start, end).map((l, i) => ({ ...l, idx: start + i }));
    },
  },
  watch: {
    progress(v) { if (!this._dragging) this.sliderVal = v; },
    currentIndex() { this.lyricIdx = -1; this.pendingId = null; this.loadLyrics(); this.sampleAccent(); },
    currentTime(t) {
      if (!this.fullLyrics.length) return;
      for (let i = 0; i < this.fullLyrics.length; i++) {
        if (this.fullLyrics[i].time <= t && (i === this.fullLyrics.length - 1 || this.fullLyrics[i + 1].time > t)) {
          if (i !== this.lyricIdx) { this.lyricIdx = i; this.scrollLyric(); }
          break;
        }
      }
    },
    playing(v) { if (v) this.resumeAudio(); },
    visible(v) {
      if (v) { this.sliderVal = this.progress || 0; this.$nextTick(() => this.startViz()); this.sampleAccent(); }
      else { this.pendingId = null; this.stopViz(); }
    },
    musicinfo() { this.loadLyrics(); },
  },
  mounted() {
    this._onVis = () => { if (!document.hidden && this.visible) this.startViz(); };
    document.addEventListener('visibilitychange', this._onVis);
  },
  beforeUnmount() {
    this.stopViz();
    document.removeEventListener('visibilitychange', this._onVis);
  },
  methods: {
    open() {
      this.visible = true;
      this.loadLyrics();
      this.sampleAccent();
      // ★ 首次打开自动展示"在线搜歌"：让访客立刻知道可以搜全网歌曲
      try {
        if (!localStorage.getItem('wb_music_search_hint_seen')) {
          this.qtab = 'search';
          this.showQueue = true;
          localStorage.setItem('wb_music_search_hint_seen', '1');
        }
      } catch (e) { /* 隐私模式忽略 */ }
      this.$nextTick(() => { this.initAudioGraph(); this.startViz(); });
    },
    closePlayer() { this.visible = false; this.stopViz(); },
    onToggle() { this.initAudioGraph(); this.resumeAudio(); this.$emit('toggle'); },
    cycleMode() {
      const order = ['order', 'single', 'random'];
      this.mode = order[(order.indexOf(this.mode) + 1) % order.length];
      this.$emit('mode', this.mode);
    },

    /* ---------- 音频可视化 ---------- */
    initAudioGraph() {
      if (window.__wbAudioGraph) { this._graph = window.__wbAudioGraph; return true; }
      const audio = document.getElementById('wb-audio');
      if (!audio) return false;
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return false;
        const ctx = new AC();
        const src = ctx.createMediaElementSource(audio);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.72;
        analyser.minDecibels = -88;
        analyser.maxDecibels = -18;
        src.connect(analyser);
        analyser.connect(ctx.destination);      // ★ 不回接 destination 会静音
        window.__wbAudioGraph = { ctx, analyser, freq: new Uint8Array(analyser.frequencyBinCount) };
        this._graph = window.__wbAudioGraph;
        return true;
      } catch (e) { console.warn('[viz] fallback to animated bars:', e); this._graph = null; return false; }
    },
    resumeAudio() {
      const g = this._graph || window.__wbAudioGraph;
      if (g && g.ctx && g.ctx.state === 'suspended') g.ctx.resume().catch(() => {});
    },
    startViz() {
      if (this._raf) return;
      const canvas = this.$refs.vizCanvas;
      if (!canvas) return;
      this.initAudioGraph();
      const c2 = canvas.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const fit = () => { canvas.width = Math.floor((canvas.clientWidth || 380) * dpr); canvas.height = Math.floor(76 * dpr); };
      fit();
      const bars = 52;
      const vals = new Array(bars).fill(0);
      const peaks = new Array(bars).fill(0);
      let t = 0;

      const loop = () => {
        this._raf = requestAnimationFrame(loop);
        if (document.hidden) return;
        const W = canvas.width, H = canvas.height;
        c2.clearRect(0, 0, W, H);
        const gap = 3 * dpr;
        const bw = Math.max(2 * dpr, (W - gap * (bars - 1)) / bars);
        const mid = H / 2;
        const g = this._graph || window.__wbAudioGraph;
        if (g) g.analyser.getByteFrequencyData(g.freq);

        t += 0.06;
        let energy = 0;
        for (let i = 0; i < bars; i++) {
          let v;
          if (g && g.freq.length) {
            const n = g.freq.length;
            const idx = Math.floor(Math.pow(i / bars, 1.7) * n * 0.62);
            v = Math.pow(g.freq[Math.min(idx, n - 1)] / 255, 0.86);
          } else {
            v = this.playing ? 0.14 + 0.11 * Math.abs(Math.sin(t + i * 0.42)) : 0.05;
          }
          if (!this.playing) v *= 0.32;
          vals[i] += (v - vals[i]) * 0.34;
          const val = Math.max(0.03, vals[i]);
          energy += val;
          peaks[i] = Math.max(peaks[i] - 0.012, val);

          const h = val * mid * 0.92;
          const x = i * (bw + gap);
          const grad = c2.createLinearGradient(0, mid - h, 0, mid + h);
          grad.addColorStop(0, this.accentLight);
          grad.addColorStop(0.5, this.accent);
          grad.addColorStop(1, this.accent2);
          c2.fillStyle = grad;
          c2.globalAlpha = 0.95;
          roundRect(c2, x, mid - h, bw, h * 2, bw / 2);        // 上下对称镜像
          c2.fill();
          c2.globalAlpha = 0.55;
          roundRect(c2, x, mid - peaks[i] * mid * 0.92 - 2 * dpr, bw, 2.2 * dpr, bw / 2);  // 峰值保持
          c2.fill();
          c2.globalAlpha = 1;
        }

        const beat = energy / bars;
        const cover = this.$refs.coverEl, halo = this.$refs.haloEl, glow = this.$refs.glowEl;
        if (cover && this.playing) cover.style.transform = `scale(${(1 + beat * 0.05).toFixed(4)})`;
        else if (cover) cover.style.transform = 'scale(1)';
        if (halo && this.playing) {
          halo.style.opacity = (0.3 + beat * 0.8).toFixed(3);
          halo.style.transform = `scale(${(1 + beat * 0.2).toFixed(3)})`;
        }
        if (glow && this.playing) glow.style.opacity = (0.26 + beat * 0.5).toFixed(3);
      };
      loop();
    },
    stopViz() {
      if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; }
      const c = this.$refs.vizCanvas;
      if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height);
      if (this.$refs.coverEl) this.$refs.coverEl.style.transform = 'scale(1)';
    },

    /* ---------- 主题色 ---------- */
    async sampleAccent() {
      const pic = this.current?.pic;
      if (!pic) return;
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = pic; });
        const c = document.createElement('canvas');
        c.width = c.height = 14;
        const cx = c.getContext('2d', { willReadFrequently: true });
        cx.drawImage(img, 0, 0, 14, 14);
        const d = cx.getImageData(0, 0, 14, 14).data;
        let r = 0, g = 0, b = 0, n = 0;
        for (let i = 0; i < d.length; i += 4) { if (d[i + 3] < 40) continue; r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
        if (!n) return;
        r /= n; g /= n; b /= n;
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
        const sat = mx === 0 ? 0 : (mx - mn) / mx;
        if (sat < 0.28) {   // 灰白封面 → 站内绿（保证频谱亮眼）
          this.accent = '#66bb6a'; this.accentLight = '#a5d6a7'; this.accent2 = '#2e7d32';
          return;
        }
        const boost = 0.12;
        r = clamp(r + (255 - r) * boost, 0, 255);
        g = clamp(g + (255 - g) * boost, 0, 255);
        b = clamp(b + (255 - b) * boost, 0, 255);
        this.accent = hex(r, g, b);
        this.accentLight = lighten(r, g, b, 0.42);
        this.accent2 = hex(r * 0.55, g * 0.55, b * 0.55);
      } catch (e) {
        this.accent = '#66bb6a'; this.accentLight = '#a5d6a7'; this.accent2 = '#2e7d32';
      }
    },

    karaokeStyle(l) {
      const next = this.fullLyrics[l.idx + 1];
      const start = l.time, end = next ? next.time : l.time + 4.5;
      const p = clamp(((this.currentTime || 0) - start) / Math.max(0.4, end - start), 0, 1);
      const pct = (p * 100).toFixed(1);
      return {
        backgroundImage: `linear-gradient(90deg, #ffffff ${pct}%, rgba(255,255,255,0.40) ${pct}%)`,
        '-webkit-background-clip': 'text', backgroundClip: 'text', color: 'transparent',
        filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.5))',
      };
    },

    async doOnlineSearch() {
      const kw = (this.onlineKw || '').trim();
      if (!kw || this.onlineLoading) return;
      this.onlineLoading = true; this.onlineError = '';
      try {
        const data = await api.musicSearch(kw, 20);
        this.onlineResults = data?.songs || [];
        this.onlineSearched = true;
      } catch (e) {
        this.onlineResults = []; this.onlineSearched = true;
        const msg = String(e?.message || '');
        this.onlineError = msg.includes('401') || msg.includes('登录') ? '请先登录后再搜歌' : (msg || '搜索失败，请稍后重试');
      } finally { this.onlineLoading = false; }
    },
    async pickOnline(s) {
      if (this.pendingId) return;
      this.pendingId = s.id; this.onlineError = '';
      try {
        const info = await api.musicSong(s.id);
        this.$emit('playonline', info);
        this.qtab = 'queue';
        setTimeout(() => { this.pendingId = null; }, 3000);
      } catch (e) {
        this.pendingId = null;
        const msg = String(e?.message || '');
        this.onlineError = msg.includes('NO_SOURCE') || msg.includes('音源')
          ? '「' + (s.name || '') + '」暂无可用音源（VIP 或解析器失效）' : (msg || '获取播放地址失败');
      }
    },
    async loadLyrics() {
      const song = this.musicinfo?.[this.currentIndex];
      if (!song) { this.fullLyrics = []; return; }
      if (song.onlineId) {
        try { const d = await api.musicLyric(song.onlineId); this.fullLyrics = this.parseLrc(d?.lrc || ''); }
        catch (e) { this.fullLyrics = []; }
        return;
      }
      if (!song.lrc) { this.fullLyrics = []; return; }
      try {
        const enc = song.lrc.split('/').map((p) => encodeURIComponent(p)).join('/');
        this.fullLyrics = this.parseLrc(await (await fetch(enc)).text());
      } catch (e) { this.fullLyrics = []; }
    },
    parseLrc(text) {
      return (text || '').split('\n').map((line) => {
        const m = line.match(/^\[(\d+):(\d+)\.(\d+)\](.*)/);
        return m ? { time: parseFloat(m[1]) * 60 + parseFloat(m[2]) + parseFloat(m[3]) / 1000, text: m[4].trim() } : null;
      }).filter((l) => l);
    },
    scrollLyric() {
      this.$nextTick(() => {
        const box = this.$refs.lyricBox;
        if (!box) return;
        const el = box.querySelector('.mp-ly-line.active');
        if (el) box.scrollTo({ top: el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2, behavior: 'smooth' });
      });
    },
    fmt(s) { if (!s || !isFinite(s)) return '0:00'; const m = Math.floor(s / 60), sec = Math.floor(s % 60); return m + ':' + (sec < 10 ? '0' : '') + sec; },
    fmtDur(ms) { return ms ? this.fmt(ms / 1000) : ''; },
  },
};
</script>

<style scoped>
.mp {
  position: relative; overflow: hidden;
  background: #0b0d10 !important; color: #fff;
  min-height: 620px; display: flex; flex-direction: column;
}
.mp-mobile { min-height: 100vh; }

/* 背景三层 */
.mp-bg {
  position: absolute; inset: -50px; z-index: 0;
  background-size: cover; background-position: center;
  filter: blur(58px) saturate(1.5) brightness(0.5);
  transform: scale(1.2); transition: background-image .8s ease;
}
.mp-glow {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  opacity: .32; transition: opacity .25s ease;
  background:
    radial-gradient(58% 34% at 50% 22%, var(--mp-a1) 0%, transparent 70%),
    radial-gradient(78% 46% at 50% 104%, var(--mp-a2) 0%, transparent 74%);
  mix-blend-mode: screen;
}
.mp-mask {
  position: absolute; inset: 0; z-index: 2;
  background: linear-gradient(180deg, rgba(8,10,13,.55) 0%, rgba(8,10,13,.66) 40%, rgba(6,8,10,.95) 100%);
}

/* 顶栏 */
.mp-top { position: relative; z-index: 4; display: flex; align-items: center; justify-content: space-between; padding: 12px 14px 2px; }
.mp-round {
  width: 38px; height: 38px; border-radius: 50%;
  background: rgba(255,255,255,.09);
  border: 1px solid rgba(255,255,255,.12);
  backdrop-filter: blur(10px);
  color: #fff; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .2s ease, transform .2s ease;
}
.mp-round:hover { background: rgba(255,255,255,.18); transform: scale(1.06); }
.mp-top-label { font-size: 11.5px; letter-spacing: 2px; color: rgba(255,255,255,.48); font-weight: 600; }

/* 封面 */
.mp-stage { position: relative; z-index: 4; flex: 1; min-height: 246px; cursor: pointer; }
.mp-cover-wrap { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; transition: opacity .38s ease, transform .38s ease; }
.mp-cover-wrap.is-hidden { opacity: 0; transform: scale(.9); pointer-events: none; }
.mp-halo {
  position: absolute; width: min(78vw, 286px); height: min(78vw, 286px);
  border-radius: 50%; pointer-events: none;
  background: radial-gradient(circle, var(--mp-a1) 0%, transparent 66%);
  filter: blur(30px); opacity: .38;
  transition: opacity .2s ease, transform .2s ease;
}
.mp-cover {
  position: relative;
  width: min(62vw, 232px); height: min(62vw, 232px);
  border-radius: 22px; overflow: hidden;
  box-shadow: 0 30px 70px rgba(0,0,0,.62), 0 8px 22px rgba(0,0,0,.42), 0 0 0 1px rgba(255,255,255,.10);
  transition: transform .12s ease-out;
  will-change: transform;
}
.mp-cover-img { width: 100%; height: 100%; }
.mp-cover-ph { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 42px; color: rgba(255,255,255,.3); }
.mp-cover-sheen {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(152deg, rgba(255,255,255,.20) 0%, rgba(255,255,255,.04) 26%, transparent 48%, rgba(255,255,255,.06) 100%);
  mix-blend-mode: overlay;
}

/* 歌词 */
.mp-lyrics {
  position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center;
  padding: 0 24px; overflow: hidden; text-align: center;
  opacity: 0; transform: translateY(14px);
  transition: opacity .38s ease, transform .38s ease;
}
.mp-lyrics.is-show { opacity: 1; transform: none; }
.mp-ly-line {
  padding: 10px 0; font-size: 14px; line-height: 1.5; color: rgba(255,255,255,.38);
  transition: color .3s ease, font-size .3s ease, opacity .3s ease;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.mp-ly-line.dim { font-size: 12px; opacity: .45; }
.mp-ly-line.next { font-size: 13px; color: rgba(255,255,255,.55); }
.mp-ly-line.active { font-size: 19px; font-weight: 700; }
.mp-ly-text { display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; transition: background-image .32s linear; }
.mp-ly-line:not(.active) .mp-ly-text { color: inherit; }

/* 曲目信息 */
.mp-meta { position: relative; z-index: 4; padding: 0 26px 2px; }
.mp-title {
  font-size: 21px; font-weight: 700; letter-spacing: .3px; line-height: 1.3;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  text-shadow: 0 2px 14px rgba(0,0,0,.5);
}
.mp-artist { font-size: 13px; color: rgba(255,255,255,.56); margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* 频谱 */
.mp-viz { position: relative; z-index: 4; width: 100%; height: 76px; display: block; margin: 6px 0 0; }

/* 进度 */
.mp-progress { position: relative; z-index: 4; padding: 0 20px; }
.mp-progress :deep(.v-slider-thumb__surface) {
  background: #fff !important;
  box-shadow: 0 0 0 4px rgba(255,255,255,.14), 0 0 16px var(--mp-a1) !important;
}
.mp-progress :deep(.v-slider-track__fill) { background: linear-gradient(90deg, var(--mp-a2), var(--mp-a1)) !important; }
.mp-progress :deep(.v-slider-track__background) { background: rgba(255,255,255,.18) !important; }
.mp-times { display: flex; justify-content: space-between; font-size: 11px; color: rgba(255,255,255,.5); margin-top: -8px; padding: 0 2px; }

/* 控制 */
.mp-controls { position: relative; z-index: 4; display: flex; align-items: center; justify-content: space-between; padding: 10px 24px 14px; }
.mp-cbtn {
  width: 46px; height: 46px; border-radius: 50%;
  background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,.88);
  display: flex; align-items: center; justify-content: center;
  transition: transform .18s ease, background .2s ease;
}
.mp-cbtn:hover { background: rgba(255,255,255,.10); transform: scale(1.08); }
.mp-cbtn:active { transform: scale(.93); }
.mp-play {
  position: relative; width: 66px; height: 66px; border-radius: 50%;
  background: #fff; color: #0b0d10; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 14px 34px rgba(0,0,0,.42), 0 0 0 1px rgba(255,255,255,.6);
  transition: transform .22s cubic-bezier(.2,.8,.2,1), box-shadow .3s ease;
}
.mp-play:hover { transform: scale(1.08); box-shadow: 0 18px 44px rgba(0,0,0,.5), 0 0 30px var(--mp-a1); }
.mp-play:active { transform: scale(.94); }
.mp-play-ring { position: absolute; inset: -7px; border-radius: 50%; border: 1px solid var(--mp-a1); opacity: 0; pointer-events: none; }
.is-playing .mp-play-ring { animation: mp-ring 2.6s ease-out infinite; }
@keyframes mp-ring {
  0% { opacity: .5; transform: scale(.94); }
  70% { opacity: 0; transform: scale(1.22); }
  100% { opacity: 0; transform: scale(1.22); }
}

/* 底部抽屉 */
.mp-sheet {
  position: relative; z-index: 4;
  border-top-left-radius: 22px; border-top-right-radius: 22px;
  background: rgba(10,12,16,.72);
  backdrop-filter: blur(22px);
  border-top: 1px solid rgba(255,255,255,.09);
  padding: 8px 16px 18px;
  max-height: 48vh; display: flex; flex-direction: column;
}
.mp-handle { width: 40px; height: 4px; border-radius: 3px; background: rgba(255,255,255,.22); margin: 0 auto 10px; }
.mp-qtabs { display: flex; gap: 8px; margin-bottom: 10px; }
.mp-qtab {
  flex: 1; padding: 9px 0; border-radius: 12px; border: none; cursor: pointer;
  font-size: 12.5px; color: rgba(255,255,255,.62);
  background: rgba(255,255,255,.07);
  display: flex; align-items: center; justify-content: center;
  transition: all .22s ease;
}
.mp-qtab:hover { background: rgba(255,255,255,.13); }
.mp-qtab.on { background: #fff; color: #0b0d10; font-weight: 700; }
.mp-qbody { display: flex; flex-direction: column; min-height: 0; }
.mp-qsearch :deep(.v-field) { border-radius: 12px !important; }
.mp-qsearch :deep(input) { color: #fff !important; font-size: 13px; }
.mp-sbar { display: flex; align-items: center; gap: 8px; }
.mp-sgo { flex: none; }
.mp-qlist { overflow-y: auto; margin-top: 9px; max-height: 30vh; }
.mp-qitem, .mp-oitem {
  display: flex; align-items: center; gap: 9px; padding: 9px 8px; border-radius: 11px;
  cursor: pointer; transition: background .18s ease; font-size: 13px;
}
.mp-qitem:hover, .mp-oitem:hover { background: rgba(255,255,255,.08); }
.mp-qitem.now { background: rgba(255,255,255,.13); }
.mp-qi-idx { width: 20px; text-align: center; color: rgba(255,255,255,.42); font-size: 11px; flex: none; }
.mp-qitem.now .mp-qi-idx { color: var(--mp-a3); }
.mp-qi-t { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mp-qitem.now .mp-qi-t { color: var(--mp-a3); font-weight: 600; }
.mp-qi-a { font-size: 11px; color: rgba(255,255,255,.42); max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mp-ocover { width: 38px; height: 38px; border-radius: 9px; overflow: hidden; flex: none; background: rgba(255,255,255,.08); }
.mp-ometa { flex: 1; min-width: 0; }
.mp-ot { font-size: 12.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mp-oa { font-size: 11px; color: rgba(255,255,255,.48); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mp-odur { font-size: 11px; color: rgba(255,255,255,.38); flex: none; }
.mp-oplay { color: rgba(255,255,255,.48); }
.mp-oitem:hover .mp-oplay { color: var(--mp-a3); }
.mp-vip { font-size: 9px; background: linear-gradient(135deg,#ffb300,#f57c00); color: #fff; padding: 1px 4px; border-radius: 3px; vertical-align: middle; }
.mp-shint { text-align: center; color: rgba(255,255,255,.5); font-size: 12.5px; padding: 22px 0; line-height: 1.95; }
.mp-shint b { color: var(--mp-a3); font-weight: 600; }
.mp-shint-sub { font-size: 11px; opacity: .75; }
.mp-serr { margin-top: 8px; padding: 8px 11px; border-radius: 10px; background: rgba(244,67,54,.16); color: #ff8a80; font-size: 11.5px; display: flex; align-items: center; gap: 5px; }

@media (max-width: 820px) {
  .mp-stage { min-height: 220px; }
  .mp-viz { height: 64px; }
  .mp-title { font-size: 19px; }
  .mp-controls { padding: 8px 18px 12px; }
  .mp-play { width: 60px; height: 60px; }
}
</style>
