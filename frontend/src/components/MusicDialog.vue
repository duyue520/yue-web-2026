<template>
  <v-dialog v-model="visible" :width="xs ? '100%' : 400" :fullscreen="xs" :scrim="true"
            transition="dialog-bottom-transition" content-class="music-dialog-wrap">
    <v-card class="mp" :class="{ 'mp-mobile': xs }" rounded="0">
      <!-- 沉浸式封面模糊背景 -->
      <div class="mp-bg" :style="bgStyle"></div>
      <div class="mp-bg-mask"></div>

      <!-- 顶部栏 -->
      <div class="mp-top">
        <v-btn icon size="small" variant="text" class="mp-icon-btn" @click="closePlayer">
          <v-icon size="22">mdi-chevron-down</v-icon>
        </v-btn>
        <div class="mp-top-meta">
          <div class="mp-top-title">{{ current?.title || '音乐' }}</div>
          <div class="mp-top-artist">{{ current?.author || '' }}</div>
        </div>
        <v-btn icon size="small" variant="text" class="mp-icon-btn" @click="showQueue = !showQueue">
          <v-icon size="22">mdi-playlist-music</v-icon>
        </v-btn>
      </div>

      <!-- 舞台：封面 / 歌词 点击切换 -->
      <div class="mp-stage" @click="showLyrics = !showLyrics">
        <!-- 大封面 -->
        <div class="mp-cover-wrap" :class="{ 'is-hidden': showLyrics }">
          <div class="mp-cover" :class="{ playing }">
            <v-img :src="current?.pic" cover class="mp-cover-img">
              <template #placeholder><div class="mp-cover-ph">♪</div></template>
            </v-img>
            <div class="mp-cover-hole"></div>
          </div>
        </div>

        <!-- 歌词 -->
        <div class="mp-lyrics" :class="{ 'is-show': showLyrics }" ref="lyricBox">
          <div v-if="fullLyrics.length === 0" class="mp-ly-empty">
            <div class="mp-ly-line active">♪ 纯音乐，请欣赏 ♪</div>
          </div>
          <template v-else>
            <div v-for="l in visibleLyrics" :key="l.idx"
                 :class="['mp-ly-line', { active: l.idx === lyricIdx, dim: l.idx < lyricIdx, next: l.idx > lyricIdx }]">
              {{ l.text || '·' }}
            </div>
          </template>
        </div>
      </div>

      <!-- 进度 -->
      <div class="mp-progress">
        <v-slider v-model="sliderVal" :max="100" hide-details thumb-size="12" color="#fff"
                  track-color="rgba(255,255,255,0.28)" track-size="3" class="mp-slider"
                  @start="_dragging = true" @end="_dragging = false; $emit('seek', sliderVal)" />
        <div class="mp-times"><span>{{ fmt(currentTime) }}</span><span>{{ fmt(duration) }}</span></div>
      </div>

      <!-- 控制栏 -->
      <div class="mp-controls">
        <v-btn icon variant="text" class="mp-ctl-sm" @click.stop="cycleMode">
          <v-icon size="20">{{ modeIcon }}</v-icon>
        </v-btn>
        <v-btn icon variant="text" class="mp-ctl-md" @click.stop="$emit('prev')">
          <v-icon size="30">mdi-skip-previous</v-icon>
        </v-btn>
        <button class="mp-play" @click.stop="$emit('toggle')">
          <v-icon size="32">{{ playing ? 'mdi-pause' : 'mdi-play' }}</v-icon>
        </button>
        <v-btn icon variant="text" class="mp-ctl-md" @click.stop="$emit('next')">
          <v-icon size="30">mdi-skip-next</v-icon>
        </v-btn>
        <v-btn icon variant="text" class="mp-ctl-sm" @click.stop="showQueue = !showQueue">
          <v-icon size="20">mdi-format-list-bulleted</v-icon>
        </v-btn>
      </div>

      <!-- 队列 / 搜歌 -->
      <v-expand-transition>
        <div v-show="showQueue" class="mp-queue">
          <div class="mp-qtabs">
            <div :class="['mp-qtab', { on: qtab === 'queue' }]" @click="qtab = 'queue'">
              播放队列 ({{ (musicinfo || []).length }})
            </div>
            <div :class="['mp-qtab', { on: qtab === 'search' }]" @click="qtab = 'search'">在线搜歌</div>
          </div>

          <!-- 队列 -->
          <div v-if="qtab === 'queue'" class="mp-qbody">
            <v-text-field v-model="search" placeholder="在队列中筛选" variant="solo-filled" density="compact"
                          hide-details prepend-inner-icon="mdi-magnify" clearable flat
                          bg-color="rgba(255,255,255,0.12)" class="mp-qsearch" />
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

          <!-- 在线搜歌 -->
          <div v-else class="mp-qbody">
            <div class="mp-sbar">
              <v-text-field v-model="onlineKw" placeholder="搜索全网歌曲 / 歌手" variant="solo-filled" density="compact"
                            hide-details prepend-inner-icon="mdi-web" clearable flat
                            bg-color="rgba(255,255,255,0.12)" class="mp-qsearch"
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
                输入关键词，全网搜歌<br /><span class="mp-shint-sub">登录后可搜可听 · VIP 歌曲视音源而定</span>
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
    };
  },
  computed: {
    current() { return this.musicinfo?.[this.currentIndex]; },
    bgStyle() {
      const pic = this.current?.pic;
      return pic ? { backgroundImage: `url("${pic}")` } : {};
    },
    modeIcon() {
      return this.mode === 'single' ? 'mdi-repeat-once' : this.mode === 'random' ? 'mdi-shuffle' : 'mdi-repeat';
    },
    filteredSongs() {
      const q = this.search.toLowerCase().trim();
      const arr = (this.musicinfo || []).map((s, i) => ({ ...s, idx: i }));
      return q ? arr.filter((s) => (s.title || '').toLowerCase().includes(q) || (s.author || '').toLowerCase().includes(q)) : arr;
    },
    visibleLyrics() {
      if (!this.fullLyrics.length) return [];
      const win = this.xs ? 5 : 7;
      const half = Math.floor(win / 2);
      let start = Math.max(0, (this.lyricIdx >= 0 ? this.lyricIdx : 0) - half);
      let end = Math.min(this.fullLyrics.length, start + win);
      if (end - start < win) start = Math.max(0, end - win);
      return this.fullLyrics.slice(start, end).map((l, i) => ({ ...l, idx: start + i }));
    },
  },
  watch: {
    progress(v) { if (!this._dragging) this.sliderVal = v; },
    currentIndex() { this.lyricIdx = -1; this.loadLyrics(); this.pendingId = null; },
    currentTime(t) {
      if (!this.fullLyrics.length) return;
      for (let i = 0; i < this.fullLyrics.length; i++) {
        if (this.fullLyrics[i].time <= t && (i === this.fullLyrics.length - 1 || this.fullLyrics[i + 1].time > t)) {
          if (i !== this.lyricIdx) { this.lyricIdx = i; this.scrollLyric(); }
          break;
        }
      }
    },
    visible(v) { if (v) { this.sliderVal = this.progress || 0; } else { this.pendingId = null; } },
    musicinfo() { this.loadLyrics(); },
  },
  methods: {
    open() { this.visible = true; this.loadLyrics(); },
    closePlayer() { this.visible = false; },
    cycleMode() {
      const order = ['order', 'single', 'random'];
      this.mode = order[(order.indexOf(this.mode) + 1) % order.length];
      this.$emit('mode', this.mode);
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
        this.showQueue = false;
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
        const encoded = song.lrc.split('/').map((p) => encodeURIComponent(p)).join('/');
        const res = await fetch(encoded);
        this.fullLyrics = this.parseLrc(await res.text());
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
  position: relative;
  overflow: hidden;
  background: #14161a !important;
  color: #fff;
  min-height: 560px;
  display: flex;
  flex-direction: column;
}
.mp-mobile { min-height: 100vh; }

/* 背景：封面模糊 + 暗色遮罩 */
.mp-bg {
  position: absolute; inset: -40px;
  background-size: cover; background-position: center;
  filter: blur(46px) saturate(1.3) brightness(0.75);
  transform: scale(1.15);
  transition: background-image .6s ease;
  z-index: 0;
}
.mp-bg-mask {
  position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(180deg, rgba(12,14,18,0.55) 0%, rgba(12,14,18,0.72) 45%, rgba(10,12,15,0.92) 100%);
}

/* 顶部 */
.mp-top { position: relative; z-index: 3; display: flex; align-items: center; gap: 8px; padding: 10px 8px 4px; }
.mp-icon-btn { color: rgba(255,255,255,0.9) !important; }
.mp-top-meta { flex: 1; min-width: 0; text-align: center; }
.mp-top-title { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mp-top-artist { font-size: 11px; color: rgba(255,255,255,0.6); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* 舞台 */
.mp-stage { position: relative; z-index: 3; flex: 1; min-height: 250px; cursor: pointer; }
.mp-cover-wrap {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  opacity: 1; transition: opacity .35s ease, transform .35s ease;
}
.mp-cover-wrap.is-hidden { opacity: 0; transform: scale(0.92); pointer-events: none; }
.mp-cover {
  width: min(64vw, 230px); height: min(64vw, 230px);
  border-radius: 50%; overflow: hidden; position: relative;
  box-shadow: 0 18px 50px rgba(0,0,0,0.5), 0 0 0 10px rgba(255,255,255,0.06);
  transition: transform .4s ease;
}
.mp-cover.playing { animation: mp-spin 22s linear infinite; }
@keyframes mp-spin { to { transform: rotate(360deg); } }
.mp-cover-img { width: 100%; height: 100%; border-radius: 50%; }
.mp-cover-ph { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 40px; color: rgba(255,255,255,0.35); }
.mp-cover-hole {
  position: absolute; top: 50%; left: 50%; width: 34px; height: 34px;
  transform: translate(-50%, -50%); border-radius: 50%;
  background: #14161a; box-shadow: 0 0 0 5px rgba(255,255,255,0.08);
}

/* 歌词 */
.mp-lyrics {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; justify-content: center;
  padding: 0 22px; overflow: hidden; text-align: center;
  opacity: 0; transform: translateY(12px);
  transition: opacity .35s ease, transform .35s ease;
}
.mp-lyrics.is-show { opacity: 1; transform: none; }
.mp-ly-line {
  padding: 9px 0; font-size: 14px; line-height: 1.5;
  color: rgba(255,255,255,0.42); transition: all .35s ease;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.mp-ly-line.dim { font-size: 12px; opacity: .55; }
.mp-ly-line.next { font-size: 13px; color: rgba(255,255,255,0.55); }
.mp-ly-line.active { color: #fff; font-size: 17px; font-weight: 700; text-shadow: 0 2px 12px rgba(0,0,0,0.5); }
.mp-ly-empty .mp-ly-line { color: rgba(255,255,255,0.75); }

/* 进度 */
.mp-progress { position: relative; z-index: 3; padding: 2px 16px 0; }
.mp-slider :deep(.v-slider-thumb__surface) { background: #fff !important; }
.mp-slider :deep(.v-slider-track__background) { background: rgba(255,255,255,0.25) !important; }
.mp-times { display: flex; justify-content: space-between; font-size: 11px; color: rgba(255,255,255,0.55); margin-top: -6px; padding: 0 4px; }

/* 控制 */
.mp-controls { position: relative; z-index: 3; display: flex; align-items: center; justify-content: space-between; padding: 8px 22px 14px; }
.mp-ctl-sm, .mp-ctl-md { color: rgba(255,255,255,0.88) !important; }
.mp-play {
  width: 62px; height: 62px; border-radius: 50%;
  background: #fff; color: #14161a;
  display: flex; align-items: center; justify-content: center;
  border: none; cursor: pointer;
  box-shadow: 0 8px 26px rgba(0,0,0,0.35);
  transition: transform .18s ease;
}
.mp-play:hover { transform: scale(1.06); }
.mp-play:active { transform: scale(0.96); }

/* 队列 / 搜歌 */
.mp-queue {
  position: relative; z-index: 3;
  border-top: 1px solid rgba(255,255,255,0.1);
  background: rgba(10,12,15,0.55);
  backdrop-filter: blur(16px);
  padding: 10px 14px 16px;
  max-height: 46vh; display: flex; flex-direction: column;
}
.mp-qtabs { display: flex; gap: 8px; margin-bottom: 8px; }
.mp-qtab {
  flex: 1; text-align: center; padding: 7px 0; border-radius: 10px;
  font-size: 12px; color: rgba(255,255,255,0.6); cursor: pointer;
  background: rgba(255,255,255,0.08); transition: all .22s ease;
}
.mp-qtab.on { background: rgba(255,255,255,0.92); color: #14161a; font-weight: 700; }
.mp-qbody { display: flex; flex-direction: column; min-height: 0; }
.mp-qsearch :deep(.v-field) { border-radius: 10px !important; }
.mp-qsearch :deep(input) { color: #fff !important; font-size: 13px; }
.mp-sbar { display: flex; align-items: center; gap: 8px; }
.mp-sgo { flex: none; }
.mp-qlist { overflow-y: auto; margin-top: 8px; max-height: 30vh; }
.mp-qitem, .mp-oitem {
  display: flex; align-items: center; gap: 9px;
  padding: 8px; border-radius: 10px; cursor: pointer;
  transition: background .18s ease; font-size: 13px;
}
.mp-qitem:hover, .mp-oitem:hover { background: rgba(255,255,255,0.09); }
.mp-qitem.now { background: rgba(102,187,106,0.18); }
.mp-qi-idx { width: 20px; text-align: center; color: rgba(255,255,255,0.45); font-size: 11px; flex: none; }
.mp-qitem.now .mp-qi-idx { color: #81c784; }
.mp-qi-t { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mp-qitem.now .mp-qi-t { color: #a5d6a7; font-weight: 600; }
.mp-qi-a { font-size: 11px; color: rgba(255,255,255,0.45); max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mp-ocover { width: 36px; height: 36px; border-radius: 8px; overflow: hidden; flex: none; background: rgba(255,255,255,0.08); }
.mp-ometa { flex: 1; min-width: 0; }
.mp-ot { font-size: 12.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mp-oa { font-size: 11px; color: rgba(255,255,255,0.5); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mp-odur { font-size: 11px; color: rgba(255,255,255,0.4); flex: none; }
.mp-oplay { color: rgba(255,255,255,0.5); }
.mp-oitem:hover .mp-oplay { color: #a5d6a7; }
.mp-vip { font-size: 9px; background: linear-gradient(135deg,#ffb300,#f57c00); color: #fff; padding: 1px 4px; border-radius: 3px; vertical-align: middle; }
.mp-shint { text-align: center; color: rgba(255,255,255,0.45); font-size: 12px; padding: 20px 0; line-height: 1.9; }
.mp-shint-sub { font-size: 11px; opacity: .8; }
.mp-serr { margin-top: 8px; padding: 7px 10px; border-radius: 9px; background: rgba(244,67,54,0.18); color: #ff8a80; font-size: 11.5px; display: flex; align-items: center; gap: 5px; }
</style>
