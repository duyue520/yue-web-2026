<template>
  <transition name="vp-fade">
    <div v-if="visible" class="vp-mask" @click.self="close()">
      <div class="vp-shell" :class="{ 'is-full': xs }">
        <!-- 顶部光带 -->
        <div class="vp-aurora"><i class="a1"></i><i class="a2"></i><i class="a3"></i></div>

        <header class="vp-head">
          <div class="vp-brand">
            <span class="vp-logo">🎬</span>
            <div>
              <div class="vp-title">影视库<span class="vp-sub">· 全网片源直连</span></div>
              <div class="vp-note">片源与解析均来自互联网公开分享，本站不存储、不转存任何视频</div>
            </div>
          </div>
          <div class="vp-tabs">
            <button :class="['vp-tab', { on: tab === 'search' }]" @click="tab = 'search'">
              <v-icon size="14">mdi-movie-search-outline</v-icon>片库搜索
            </button>
            <button :class="['vp-tab', { on: tab === 'vip' }]" @click="tab = 'vip'">
              <v-icon size="14">mdi-crown-outline</v-icon>VIP 解析
            </button>
          </div>
          <button class="vp-x" @click="close()"><v-icon size="17">mdi-close</v-icon></button>
        </header>

        <!-- ============ 片库搜索 ============ -->
        <div v-show="tab === 'search'" class="vp-body">
          <div class="vp-search">
            <v-icon size="18" class="vp-search-ico">mdi-magnify</v-icon>
            <input v-model="kw" class="vp-input" maxlength="30" placeholder="搜剧名、动漫、电影…（回车搜索）"
                   :disabled="searching" @keyup.enter="doSearch" />
            <button class="vp-go" :disabled="searching || !kw.trim()" @click="doSearch">
              {{ searching ? '搜索中…' : '搜索' }}
            </button>
          </div>
          <div class="vp-hot">
            <span class="vp-hot-t">热门</span>
            <button v-for="h in hotWords" :key="h" class="vp-hot-c" @click="quickSearch(h)">{{ h }}</button>
          </div>

          <!-- 骨架屏 -->
          <div v-if="searching" class="vp-grid">
            <div v-for="i in 8" :key="i" class="vp-card sk"><div class="vp-poster sk-anim"></div><div class="vp-line sk-anim"></div></div>
          </div>

          <div v-else-if="results.length" class="vp-grid">
            <div v-for="r in results" :key="r.id" class="vp-card" @click="openDetail(r)">
              <div class="vp-poster" :style="r.pic ? { backgroundImage: `url(${r.pic})` } : {}">
                <span v-if="!r.pic" class="vp-noimg">无海报</span>
                <span class="vp-src">{{ r.src || '主源' }}</span>
                <span class="vp-play-ico"><v-icon size="26">mdi-play-circle</v-icon></span>
              </div>
              <div class="vp-line">{{ r.name }}</div>
            </div>
          </div>

          <div v-else-if="searched" class="vp-empty">
            <v-icon size="40">mdi-movie-off-outline</v-icon>
            <p>没搜到「{{ lastKw }}」，换个名字试试</p>
          </div>
          <div v-else class="vp-empty">
            <v-icon size="40">mdi-popcorn</v-icon>
            <p>输入片名开搜，或点上面的热门词</p>
          </div>
        </div>

        <!-- ============ VIP 解析 ============ -->
        <div v-show="tab === 'vip'" class="vp-body">
          <div class="vp-tip">
            <v-icon size="14">mdi-information-outline</v-icon>
            粘贴爱奇艺 / 腾讯视频 / 优酷 / 芒果 / B站的视频页链接，选一条解析线路即可播放（若卡顿就换线路）
          </div>
          <div class="vp-search">
            <v-icon size="18" class="vp-search-ico">mdi-link-variant</v-icon>
            <input v-model="vipUrl" class="vp-input" placeholder="粘贴视频页链接，如 https://v.qq.com/x/cover/xxx.html" />
            <button class="vp-go" :disabled="!vipUrl.trim()" @click="playVip([vipUrl])">解析</button>
          </div>
          <div class="vp-lines">
            <button v-for="l in lines" :key="l.name" class="vp-line-chip" :class="{ on: vipLine && vipLine.name === l.name }"
                    @click="vipLine = l; if (vipUrl.trim()) playVip([vipUrl])">{{ l.name }}</button>
          </div>
          <div v-if="vipSrc" class="vp-player-wrap">
            <iframe class="vp-frame" :src="vipSrc" allow="autoplay; encrypted-media; fullscreen" allowfullscreen referrerpolicy="no-referrer"></iframe>
          </div>
          <div v-else class="vp-empty small">
            <v-icon size="34">mdi-television-play</v-icon>
            <p>贴个链接 + 点一条线路，影片就出来了</p>
          </div>
        </div>

        <!-- ============ 详情播放层 ============ -->
        <transition name="vp-slide">
          <div v-if="detail" class="vp-detail">
            <div class="vp-hero" :style="detail.pic ? { backgroundImage: `url(${detail.pic})` } : {}">
              <div class="vp-hero-mask"></div>
              <div class="vp-hero-in">
                <div class="vp-hero-poster" :style="detail.pic ? { backgroundImage: `url(${detail.pic})` } : {}"></div>
                <div class="vp-hero-info">
                  <h3>{{ detail.name }}</h3>
                  <div class="vp-meta">
                    <span v-if="detail.year">{{ detail.year }}</span>
                    <span v-if="detail.type">{{ detail.type }}</span>
                    <span v-if="detail.area">{{ detail.area }}</span>
                    <span v-if="detail.remarks">{{ detail.remarks }}</span>
                    <span v-if="detail.eps.length">共 {{ detail.eps.length }} 集</span>
                  </div>
                  <p v-if="detail.content" class="vp-story">{{ detail.content }}</p>
                  <div class="vp-actions">
                    <button class="vp-btn primary" @click="playEp(0, true)"><v-icon size="15">mdi-play</v-icon>从头播放</button>
                    <button class="vp-btn" @click="useFallback = !useFallback"><v-icon size="15">mdi-swap-horizontal</v-icon>{{ useFallback ? '用直连播放' : '切备用线路' }}</button>
                    <button class="vp-btn" @click="detail = null"><v-icon size="15">mdi-arrow-left</v-icon>返回</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="vp-player-wrap">
              <video v-show="!useFallback" ref="videoEl" class="vp-video" controls playsinline></video>
              <iframe v-show="useFallback && fallbackSrc" class="vp-frame" :src="fallbackSrc"
                      allow="autoplay; encrypted-media; fullscreen" allowfullscreen referrerpolicy="no-referrer"></iframe>
              <div v-if="loadingEp" class="vp-loading">
                <div class="vp-spin"></div>
                <p>{{ loadMsg }}</p>
              </div>
              <div v-if="playErr" class="vp-err">
                <p>{{ playErr }}</p>
                <button class="vp-btn primary" @click="useFallback = true">用备用线路播放</button>
              </div>
            </div>

            <div v-if="curEp" class="vp-now">正在播放：{{ curEp.name }}<span v-if="detail.src" class="vp-now-src">· 线路 {{ detail.src }}</span>
              <span v-if="qualities.length" class="vp-qwrap">
                <button v-for="(q, i) in qualities" :key="i" :class="['vp-qchip', { on: i === curLevel }]" @click="setLevel(i)">{{ q }}</button>
              </span>
            </div>

            <div class="vp-eps">
              <button v-for="(e, i) in detail.eps" :key="i" :class="['vp-ep', { on: i === curIdx }]" @click="playEp(i)">
                {{ e.name }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'VideoPage',
  data() {
    return {
      visible: false,
      xs: false,
      tab: 'search',
      kw: '',
      lastKw: '',
      searched: false,
      searching: false,
      results: [],
      hotWords: ['斗罗大陆', '完美世界', '遮天', '火影忍者', '海贼王', '咒术回战', '繁花', '庆余年'],
      // VIP 解析线路（来自开源油猴脚本 video_vip 的公开线路）
      lines: [
        { name: '虾米解析', url: 'https://jx.xmflv.com/?url=' },
        { name: 'HLS解析', url: 'https://jx.hls.one/?url=' },
        { name: 'playm3u8', url: 'https://www.playm3u8.cn/jiexi.php?url=' },
        { name: 'fongmi', url: 'https://json.fongmi.cc/web?url=' },
        { name: '冰豆解析', url: 'https://bd.jx.cn/?url=' },
        { name: '七七云', url: 'https://jx.77flv.cc/?url=' },
        { name: 'CK解析', url: 'https://www.ckplayer.vip/jiexi/?url=' },
        { name: '花旗解析', url: 'https://www.huaqi.live/?url=' },
        { name: 'Player-JY', url: 'https://jx.playerjy.com/?url=' },
        { name: '邦宁云', url: 'https://video.isyour.love/player/getplayer?url=' },
        { name: 'Yparse', url: 'https://jx.yparse.com/index.php?url=' },
        { name: 'TXNQ解析', url: 'https://bfq.txnp.cn/player?url=' },
        { name: '七哥解析', url: 'https://jx.202617.xyz/tv.php?url=' },
        { name: '789解析', url: 'https://jiexi.789jiexi.icu:4433/?url=' },
        { name: '极速解析', url: 'https://jx.2s0.cn/player/?url=' },
      ],
      vipUrl: '',
      vipLine: null,
      vipSrc: '',
      detail: null,
      curIdx: -1,
      curEp: null,
      useFallback: false,
      fallbackSrc: '',
      loadingEp: false,
      loadMsg: '',
      playErr: '',
      _hls: null,
      qualities: [],
      curLevel: -1,
    };
  },
  mounted() {
    const sync = () => { this.xs = window.innerWidth < 700; };
    sync();
    try { window.addEventListener('resize', sync); } catch (e) {}
  },
  methods: {
    open() { this.visible = true; },
    close() {
      this.visible = false;
      this.stopPlay();
    },
    stopPlay() {
      try { if (this._hls) { this._hls.destroy(); this._hls = null; } } catch (e) {}
      const v = this.$refs.videoEl;
      if (v) { try { v.pause(); v.removeAttribute('src'); v.load(); } catch (e) {} }
    },
    quickSearch(w) { this.kw = w; this.doSearch(); },
    async doSearch() {
      const kw = (this.kw || '').trim();
      if (!kw || this.searching) return;
      this.searching = true; this.searched = true; this.lastKw = kw; this.detail = null;
      this.stopPlay();
      try {
        const r = await fetch('/api/video/search?kw=' + encodeURIComponent(kw));
        const j = await r.json();
        this.results = j.list || [];
      } catch (e) { this.results = []; }
      this.searching = false;
    },
    async openDetail(r) {
      this.stopPlay();
      this.loadingEp = false; this.playErr = '';
      try {
        const res = await fetch('/api/video/detail?id=' + encodeURIComponent(r.id) + '&src=' + encodeURIComponent(r.src || '主源'));
        const d = await res.json();
        if (!d.eps) { alert('这部暂时没片源，换一部试试'); return; }
        this.detail = d;
        this.curIdx = -1; this.curEp = null;
        this.useFallback = false; this.fallbackSrc = '';
      } catch (e) { alert('加载详情失败，稍后再试'); }
    },
    async playEp(i, auto) {
      if (!this.detail || !this.detail.eps[i]) return;
      this.curIdx = i;
      const ep = this.detail.eps[i];
      this.curEp = ep;
      this.playErr = '';
      this.useFallback = false;
      this.fallbackSrc = '';
      this.loadingEp = true;
      this.loadMsg = '正在建立直连…';
      await this.$nextTick();
      const ok = await this.nativePlay(ep.url);
      this.loadingEp = false;
      if (!ok) {
        this.playErr = '直连没能播放（片源可能限制跨域）';
      }
    },
    async nativePlay(url) {
      const v = this.$refs.videoEl;
      if (!v || !url) return false;
      try { if (this._hls) { this._hls.destroy(); this._hls = null; } } catch (e) {}
      const isM3u8 = /\.m3u8(\?|$)/i.test(url);
      if (isM3u8 && v.canPlayType('application/vnd.apple.mpegurl') && !window.MediaSource) {
        // Safari 原生 HLS
        v.src = url;
        v.play().catch(() => {});
        return true;
      }
      if (isM3u8) {
        try {
          const mod = await import('hls.js');
          const Hls = mod.default || mod.Hls;
          if (Hls && Hls.isSupported()) {
            const hls = new Hls({ maxBufferLength: 30, manifestLoadingTimeOut: 15000 });
            this._hls = hls;
            this.qualities = []; this.curLevel = -1;
            hls.on(Hls.Events.MANIFEST_PARSED, (e, d) => {
              const lv = (d && d.levels) || hls.levels || [];
              this.qualities = lv.map((l) => (l.height ? l.height + 'P' : Math.round((l.bitrate || 0) / 1000) + 'k'));
              if (lv.length > 1) { hls.currentLevel = lv.length - 1; this.curLevel = lv.length - 1; }
              else if (lv.length === 1) { this.curLevel = 0; }
            });
            hls.on(Hls.Events.LEVEL_SWITCHED, (e, d) => { this.curLevel = d.level; });
            hls.on(Hls.Events.ERROR, (e, data) => {
              if (data && data.fatal) {
                this.playErr = '直连播放失败，已为你准备好备用线路';
                this.fallbackSrc = 'https://wsyzy.vip/m3u8/?url=' + encodeURIComponent(url);
                this.useFallback = true;
              }
            });
            hls.loadSource(url);
            hls.attachMedia(v);
            v.play().catch(() => {});
            return true;
          }
        } catch (e) {}
      }
      // 直链 mp4 或其他
      try { v.src = url; v.play().catch(() => {}); return true; } catch (e) { return false; }
    },
    setLevel(i) {
      if (this._hls) { this._hls.currentLevel = i; this.curLevel = i; }
    },
    playVip(urls) {
      const line = this.vipLine || this.lines[0];
      this.vipLine = line;
      const target = (urls && urls[0]) || this.vipUrl;
      if (!target) return;
      this.vipSrc = line.url + encodeURIComponent(target.trim());
    },
  },
};
</script>

<style scoped>
.vp-mask { position: fixed; inset: 0; z-index: 2350; display: flex; align-items: center; justify-content: center;
  background: rgba(4, 7, 18, .78); backdrop-filter: blur(10px); }
.vp-shell { position: relative; width: min(1080px, 96vw); height: min(760px, 94vh); overflow: hidden;
  border-radius: 22px; display: flex; flex-direction: column;
  background: radial-gradient(1200px 500px at 10% -10%, #17203a 0%, #0b1020 45%, #070a14 100%);
  border: 1px solid rgba(120, 160, 255, .18);
  box-shadow: 0 30px 90px rgba(0, 0, 0, .65), inset 0 1px 0 rgba(255, 255, 255, .06); }
.vp-shell.is-full { width: 100vw; height: 100vh; border-radius: 0; }
.vp-aurora { position: absolute; inset: 0; pointer-events: none; opacity: .5; }
.vp-aurora i { position: absolute; border-radius: 50%; filter: blur(70px); }
.vp-aurora .a1 { width: 340px; height: 340px; left: -90px; top: -120px; background: rgba(56, 189, 248, .30); }
.vp-aurora .a2 { width: 300px; height: 300px; right: -80px; top: 20%; background: rgba(217, 70, 239, .22); }
.vp-aurora .a3 { width: 300px; height: 300px; left: 35%; bottom: -140px; background: rgba(250, 204, 21, .14); }

.vp-head { position: relative; z-index: 2; display: flex; align-items: center; gap: 14px; padding: 16px 20px 10px; }
.vp-brand { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.vp-logo { font-size: 26px; filter: drop-shadow(0 0 12px rgba(250, 204, 21, .6)); }
.vp-title { font-size: 18px; font-weight: 900; letter-spacing: .5px;
  background: linear-gradient(90deg, #7dd3fc, #e879f9 55%, #fde68a); -webkit-background-clip: text; background-clip: text; color: transparent; }
.vp-sub { font-size: 11px; font-weight: 600; color: #8b9cc7; margin-left: 6px; letter-spacing: 0; -webkit-text-fill-color: #8b9cc7; }
.vp-note { font-size: 10.5px; color: #61708f; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.vp-tabs { display: flex; gap: 6px; }
.vp-tab { border: 1px solid rgba(125, 211, 252, .25); background: rgba(125, 211, 252, .08); color: #bae6fd;
  font-size: 12.5px; font-weight: 700; padding: 7px 14px; border-radius: 999px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: all .2s; }
.vp-tab.on { background: linear-gradient(120deg, #0ea5e9, #8b5cf6); color: #fff; border-color: transparent; box-shadow: 0 6px 18px rgba(56, 189, 248, .35); }
.vp-x { width: 34px; height: 34px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, .12); background: rgba(255, 255, 255, .06); color: #cbd5e1; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.vp-x:hover { background: rgba(244, 63, 94, .2); color: #fda4af; }

.vp-body { position: relative; z-index: 1; flex: 1; overflow-y: auto; padding: 6px 20px 22px; }
.vp-search { display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, .05);
  border: 1.5px solid rgba(125, 211, 252, .22); border-radius: 999px; padding: 4px 6px 4px 14px; transition: all .25s; }
.vp-search:focus-within { border-color: #38bdf8; box-shadow: 0 0 0 4px rgba(56, 189, 248, .14), 0 0 26px rgba(56, 189, 248, .22); }
.vp-search-ico { color: #7dd3fc; }
.vp-input { flex: 1; background: transparent; border: none; outline: none; color: #e2e8f0; font-size: 14px; padding: 10px 4px; }
.vp-input::placeholder { color: #5b6b8c; }
.vp-go { border: none; border-radius: 999px; padding: 10px 22px; font-size: 13.5px; font-weight: 800; cursor: pointer;
  color: #041024; background: linear-gradient(120deg, #7dd3fc, #a78bfa); box-shadow: 0 6px 20px rgba(125, 211, 252, .35); }
.vp-go:disabled { opacity: .5; cursor: not-allowed; }
.vp-hot { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin: 12px 2px 16px; }
.vp-hot-t { font-size: 11px; color: #64748b; }
.vp-hot-c { border: 1px dashed rgba(148, 163, 184, .4); background: transparent; color: #94a3b8; font-size: 12px; padding: 3px 10px; border-radius: 999px; cursor: pointer; }
.vp-hot-c:hover { color: #7dd3fc; border-color: #38bdf8; }

.vp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 14px; }
.vp-card { cursor: pointer; transition: transform .22s cubic-bezier(.2, .8, .2, 1.2); }
.vp-card:hover { transform: translateY(-5px) scale(1.03); }
.vp-poster { position: relative; width: 100%; aspect-ratio: 2/3; border-radius: 12px; background: #101830 center/cover no-repeat;
  border: 1px solid rgba(148, 163, 184, .16); overflow: hidden; display: flex; align-items: center; justify-content: center; }
.vp-card:hover .vp-poster { border-color: rgba(56, 189, 248, .65); box-shadow: 0 10px 30px rgba(56, 189, 248, .28); }
.vp-play-ico { opacity: 0; transition: opacity .2s; color: #fff; filter: drop-shadow(0 2px 10px rgba(0, 0, 0, .7)); }
.vp-card:hover .vp-play-ico { opacity: 1; }
.vp-noimg { font-size: 11px; color: #475569; }
.vp-line { margin-top: 7px; font-size: 12.5px; color: #cbd5e1; text-align: center; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.vp-empty { text-align: center; color: #64748b; padding: 46px 0; }
.vp-empty p { margin-top: 10px; font-size: 13.5px; }
.vp-empty.small { padding: 30px 0; }

.sk .vp-poster { background: #131b2f; }
.sk-anim { animation: vp-pulse 1.2s ease-in-out infinite; }
@keyframes vp-pulse { 0%, 100% { opacity: .5; } 50% { opacity: 1; } }

.vp-tip { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #93a4c4; background: rgba(56, 189, 248, .07);
  border: 1px dashed rgba(56, 189, 248, .3); border-radius: 12px; padding: 10px 12px; margin-bottom: 12px; }
.vp-lines { display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0; }
.vp-line-chip { border: 1px solid rgba(148, 163, 184, .28); background: rgba(255, 255, 255, .04); color: #94a3b8; font-size: 12px; padding: 5px 12px; border-radius: 999px; cursor: pointer; transition: all .18s; }
.vp-line-chip:hover { color: #e2e8f0; border-color: #8b5cf6; }
.vp-line-chip.on { background: linear-gradient(120deg, #8b5cf6, #ec4899); color: #fff; border-color: transparent; }

.vp-detail { position: absolute; inset: 0; z-index: 5; overflow-y: auto; padding: 0 20px 24px;
  background: linear-gradient(180deg, rgba(7, 10, 20, .96), rgba(7, 10, 20, .99)); }
.vp-hero { position: relative; margin: -1px -20px 16px; padding: 18px 20px; background: #0d1424 center/cover no-repeat; }
.vp-hero-mask { position: absolute; inset: 0; backdrop-filter: blur(22px) brightness(.42); background: linear-gradient(90deg, rgba(7, 10, 20, .88), rgba(7, 10, 20, .45)); }
.vp-hero-in { position: relative; display: flex; gap: 16px; }
.vp-hero-poster { width: 116px; aspect-ratio: 2/3; border-radius: 12px; background: #101830 center/cover no-repeat; flex: none;
  border: 1px solid rgba(125, 211, 252, .3); box-shadow: 0 12px 34px rgba(0, 0, 0, .6); }
.vp-hero-info h3 { font-size: 20px; font-weight: 900; color: #f1f5f9; margin-bottom: 6px; }
.vp-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.vp-meta span { font-size: 11px; color: #a5b4fc; background: rgba(99, 102, 241, .18); border: 1px solid rgba(129, 140, 248, .35); padding: 2px 9px; border-radius: 999px; }
.vp-story { font-size: 12px; color: #94a3b8; line-height: 1.7; max-height: 62px; overflow: hidden; margin-bottom: 10px; }
.vp-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.vp-btn { display: inline-flex; align-items: center; gap: 5px; border: 1px solid rgba(148, 163, 184, .3); background: rgba(255, 255, 255, .05); color: #cbd5e1;
  font-size: 12.5px; font-weight: 700; padding: 8px 14px; border-radius: 10px; cursor: pointer; }
.vp-btn:hover { border-color: #38bdf8; color: #e0f2fe; }
.vp-btn.primary { background: linear-gradient(120deg, #0ea5e9, #8b5cf6); border-color: transparent; color: #fff; box-shadow: 0 6px 18px rgba(14, 165, 233, .35); }

.vp-player-wrap { position: relative; width: 100%; aspect-ratio: 16/9; background: #000; border-radius: 14px; overflow: hidden;
  border: 1px solid rgba(125, 211, 252, .25); box-shadow: 0 16px 44px rgba(0, 0, 0, .6), 0 0 0 1px rgba(139, 92, 246, .12) inset; }
.vp-video, .vp-frame { position: absolute; inset: 0; width: 100%; height: 100%; border: none; background: #000; }
.vp-loading, .vp-err { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; background: rgba(3, 6, 14, .82); color: #93c5fd; font-size: 13px; z-index: 3; }
.vp-err { background: rgba(24, 6, 14, .9); color: #fda4af; }
.vp-spin { width: 34px; height: 34px; border-radius: 50%; border: 3px solid rgba(125, 211, 252, .25); border-top-color: #38bdf8; animation: vp-rot .8s linear infinite; }
@keyframes vp-rot { to { transform: rotate(360deg); } }
.vp-now { margin: 10px 2px 6px; font-size: 12.5px; color: #7dd3fc; display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.vp-now-src { color: #94a3b8; }
.vp-qwrap { display: inline-flex; gap: 4px; margin-left: auto; }
.vp-qchip { border: 1px solid rgba(125, 211, 252, .3); background: rgba(125, 211, 252, .08); color: #bae6fd; font-size: 11px; padding: 2px 8px; border-radius: 999px; cursor: pointer; }
.vp-qchip.on { background: linear-gradient(120deg, #0ea5e9, #8b5cf6); color: #fff; border-color: transparent; }
.vp-src { position: absolute; top: 6px; left: 6px; font-size: 10px; color: #e0f2fe; background: rgba(2, 6, 23, .72); border: 1px solid rgba(125, 211, 252, .4); border-radius: 6px; padding: 1px 6px; backdrop-filter: blur(4px); }
.vp-eps { display: grid; grid-template-columns: repeat(auto-fill, minmax(82px, 1fr)); gap: 7px; margin-top: 8px; }
.vp-ep { border: 1px solid rgba(148, 163, 184, .25); background: rgba(255, 255, 255, .04); color: #b6c2d9; font-size: 12px;
  padding: 7px 4px; border-radius: 9px; cursor: pointer; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; transition: all .16s; }
.vp-ep:hover { border-color: #38bdf8; color: #e0f2fe; }
.vp-ep.on { background: linear-gradient(120deg, #0ea5e9, #8b5cf6); color: #fff; border-color: transparent; box-shadow: 0 4px 14px rgba(56, 189, 248, .3); }

.vp-fade-enter-active, .vp-fade-leave-active { transition: opacity .22s; }
.vp-fade-enter-from, .vp-fade-leave-to { opacity: 0; }
.vp-slide-enter-active { transition: all .28s cubic-bezier(.2, .8, .2, 1); }
.vp-slide-enter-from { opacity: 0; transform: translateY(22px); }

@media (max-width: 700px) {
  .vp-head { flex-wrap: wrap; gap: 8px; }
  .vp-brand { width: 100%; }
  .vp-note { display: none; }
  .vp-hero-in { flex-direction: column; align-items: center; text-align: center; }
  .vp-hero-poster { width: 96px; }
  .vp-actions { justify-content: center; }
  .vp-grid { grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 10px; }
}
</style>
