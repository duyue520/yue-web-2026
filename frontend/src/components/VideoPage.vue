<template>
  <transition name="vp-fade">
    <div v-if="visible" class="vp-mask" @click.self="close()">
      <div class="vp-shell" :class="{ 'is-full': xs }">
        <div class="vp-aurora"><i class="a1"></i><i class="a2"></i><i class="a3"></i></div>

        <header class="vp-head">
          <button v-if="view !== 'home'" class="vp-back" @click="goHome"><v-icon size="16">mdi-chevron-left</v-icon></button>
          <div class="vp-brand">
            <span class="vp-logo">🎬</span>
            <div>
              <div class="vp-title">影视库<span class="vp-sub">· 全网片源直连</span></div>
              <div class="vp-note">片源来自互联网公开分享，本站不存储任何视频、视频流量不经本站</div>
            </div>
          </div>
          <div class="vp-tabs">
            <button :class="['vp-tab', { on: view === 'vip' }]" @click="view = 'vip'">
              <v-icon size="14">mdi-crown-outline</v-icon>VIP 解析
            </button>
          </div>
          <button class="vp-x" @click="close()"><v-icon size="17">mdi-close</v-icon></button>
        </header>

        <transition name="vp-drop">
          <div v-if="toast" class="vp-toast"><v-icon size="14">mdi-auto-fix</v-icon>{{ toast }}</div>
        </transition>

        <!-- ==================== VIP 解析 ==================== -->
        <div v-if="view === 'vip'" class="vp-body">
          <div class="vp-tip"><v-icon size="14">mdi-information-outline</v-icon>粘贴爱奇艺 / 腾讯 / 优酷 / 芒果 / B站链接，选线路播放；卡顿就换别的线路</div>
          <div class="vp-search">
            <v-icon size="18" class="vp-search-ico">mdi-link-variant</v-icon>
            <input v-model="vipUrl" class="vp-input" placeholder="粘贴视频页链接，如 https://v.qq.com/x/cover/xxx.html" />
            <button class="vp-go" :disabled="!vipUrl.trim()" @click="playVip([vipUrl])">解析</button>
          </div>
          <div class="vp-lines">
            <button v-for="l in lines" :key="l.name" class="vp-line-chip" :class="{ on: vipLine && vipLine.name === l.name }" @click="pickLine(l)">{{ l.name }}</button>
          </div>
          <div v-if="vipSrc" class="vp-player-wrap">
            <iframe class="vp-frame" :src="vipSrc" allow="autoplay; encrypted-media; fullscreen" allowfullscreen referrerpolicy="no-referrer"></iframe>
          </div>
          <div v-else class="vp-empty small">
            <span class="vp-empty-orb soft"><v-icon size="30">mdi-television-play</v-icon></span>
            <p>贴链接 + 点线路，影片就出来了</p>
          </div>
        </div>

        <!-- ==================== 首页 ==================== -->
        <div v-else-if="view === 'home'" class="vp-body">
          <div class="vp-searchwrap">
            <div class="vp-search">
              <v-icon size="18" class="vp-search-ico">mdi-magnify</v-icon>
              <input v-model="kw" class="vp-input" maxlength="30" placeholder="搜剧名、动漫、电影…"
                     :disabled="searching" @keyup.enter="doSearch" @input="onInput" @focus="sugOpen = sugList.length > 0" @blur="closeSugSoon" />
              <button class="vp-go" :disabled="searching || !kw.trim()" @click="doSearch">{{ searching ? '搜索中…' : '搜索' }}</button>
            </div>
            <transition name="vp-drop">
              <div v-if="sugOpen && sugList.length" class="vp-sug">
                <button v-for="(s, i) in sugList" :key="i" @mousedown.prevent="quickSearch(s.name)">
                  <v-icon size="13">mdi-magnify</v-icon>{{ s.name }}
                </button>
              </div>
            </transition>
          </div>

          <div class="vp-chips">
            <button v-for="t in homeTypes" :key="t.id" class="vp-chip" @click="openList(t)">{{ t.name }}</button>
          </div>

          <div v-if="recent.length" class="vp-hot">
            <span class="vp-hot-t">最近</span>
            <button v-for="r in recent" :key="r" class="vp-hot-c" @click="quickSearch(r)">{{ r }}</button>
            <button class="vp-hot-c clear" @click="clearRecent"><v-icon size="11">mdi-delete-outline</v-icon></button>
          </div>

          <div v-if="homeLoading" class="vp-rowload">
            <div class="vp-rowtitle sk-anim"></div>
            <div class="vp-rail"><div v-for="i in 6" :key="i" class="vp-mini sk-anim"></div></div>
          </div>

          <div v-else-if="!homeRows.length" class="vp-empty">
            <span class="vp-empty-orb"><v-icon size="32">mdi-cloud-off-outline</v-icon></span>
            <p>首页片源暂时开小差</p>
            <button class="vp-btn primary" @click="loadHome(true)"><v-icon size="14">mdi-refresh</v-icon>重新加载</button>
          </div>

          <template v-else>
            <div v-for="(row, ri) in homeRows" :key="ri" class="vp-row">
              <div class="vp-rowhead">
                <span class="vp-rowtitle">{{ row.name }}</span>
                <button v-if="row.kw" class="vp-more" @click="openList({ id: row.kw, name: row.name })">更多<v-icon size="13">mdi-chevron-right</v-icon></button>
              </div>
              <div class="vp-rail">
                <div v-for="it in row.items" :key="it.src + it.id" class="vp-card rail" @click="openDetail(it)" @mouseenter="prefetch(it)">
                  <div class="vp-poster" :style="it.pic ? { backgroundImage: `url(${it.pic})` } : {}">
                    <span v-if="!it.pic" class="vp-noimg">无海报</span>
                    <span class="vp-grad"></span>
                    <span v-if="it.remarks" class="vp-rem">{{ it.remarks }}</span>
                    <span class="vp-play-ico"><v-icon size="26">mdi-play-circle</v-icon></span>
                  </div>
                  <div class="vp-line">{{ it.name }}</div>
                </div>
              </div>
            </div>

            <div v-if="favs.length" class="vp-row">
              <div class="vp-rowhead"><span class="vp-rowtitle">❤️ 我的收藏</span></div>
              <div class="vp-rail">
                <div v-for="f in favs" :key="'fav' + f.name" class="vp-card rail" @click="openDetailCheat(f)">
                  <div class="vp-poster" :style="f.pic ? { backgroundImage: `url(${f.pic})` } : {}"><span class="vp-grad"></span><span class="vp-play-ico"><v-icon size="26">mdi-play-circle</v-icon></span></div>
                  <div class="vp-line">{{ f.name }}</div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- ==================== 分类列表 ==================== -->
        <div v-else-if="view === 'list'" class="vp-body">
          <div class="vp-lhead">
            <span class="vp-ltitle">{{ listTitle }}</span>
            <span class="vp-lcount" v-if="listItems.length">已加载 {{ listItems.length }} 部</span>
          </div>
          <div v-if="listLoading && !listItems.length" class="vp-grid">
            <div v-for="i in 12" :key="i" class="vp-card"><div class="vp-poster sk-anim"></div><div class="vp-line bar sk-anim"></div></div>
          </div>
          <div v-else class="vp-grid">
            <div v-for="it in listItems" :key="it.src + it.id" class="vp-card" @click="openDetail(it)" @mouseenter="prefetch(it)">
              <div class="vp-poster" :style="it.pic ? { backgroundImage: `url(${it.pic})` } : {}">
                <span v-if="!it.pic" class="vp-noimg">无海报</span>
                <span class="vp-grad"></span>
                <span v-if="it.remarks" class="vp-rem">{{ it.remarks }}</span>
                <span class="vp-play-ico"><v-icon size="30">mdi-play-circle</v-icon></span>
              </div>
              <div class="vp-line">{{ it.name }}</div>
            </div>
          </div>
          <div class="vp-morewrap">
            <button v-if="listHasMore" class="vp-btn primary" :disabled="listLoading" @click="loadMore">
              <v-icon size="14">{{ listLoading ? 'mdi-loading mdi-spin' : 'mdi-chevron-down' }}</v-icon>{{ listLoading ? '加载中…' : '加载更多' }}
            </button>
            <span v-else-if="listItems.length" class="vp-end">— 到底啦 —</span>
          </div>
        </div>

        <!-- ==================== 搜索结果 ==================== -->
        <div v-else-if="view === 'search'" class="vp-body">
          <div class="vp-lhead"><span class="vp-ltitle">「{{ lastKw }}」的搜索结果</span><span class="vp-lcount">{{ results.length }} 部</span></div>
          <div v-if="searching" class="vp-grid">
            <div v-for="i in 10" :key="i" class="vp-card"><div class="vp-poster sk-anim"></div><div class="vp-line bar sk-anim"></div></div>
          </div>
          <div v-else-if="results.length" class="vp-grid">
            <div v-for="r in results" :key="r.src + r.id" class="vp-card" @click="openDetail(r)" @mouseenter="prefetch(r)">
              <div class="vp-poster" :style="r.pic ? { backgroundImage: `url(${r.pic})` } : {}">
                <span v-if="!r.pic" class="vp-noimg">无海报</span>
                <span class="vp-grad"></span>
                <span class="vp-src" :class="{ star: r.src === bestSrc }">{{ r.src === bestSrc ? '★ ' : '' }}{{ r.src }}</span>
                <span class="vp-play-ico"><v-icon size="30">mdi-play-circle</v-icon></span>
              </div>
              <div class="vp-line">{{ r.name }}</div>
            </div>
          </div>
          <div v-else class="vp-empty err">
            <span class="vp-empty-orb"><v-icon size="32">mdi-movie-off-outline</v-icon></span>
            <p>没搜到「{{ lastKw }}」<br><small>换个片名，或点下方按钮重试</small></p>
            <button class="vp-btn primary" @click="doSearch"><v-icon size="14">mdi-refresh</v-icon>再试一次</button>
          </div>
        </div>

        <!-- ==================== 详情播放 ==================== -->
        <div v-else-if="view === 'detail' && detail" class="vp-body detail">
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
                  <span v-if="detail.eps.length">{{ detail.eps.length }} 集</span>
                  <span v-if="detail.maxRes" class="res">{{ detail.maxRes }} 画质</span>
                  <span class="src">线路 {{ detail.src }}</span>
                </div>
                <p v-if="detail.content" class="vp-story">{{ detail.content }}</p>
                <div class="vp-actions">
                  <button class="vp-btn primary" @click="playEp(prog.ep || 0, true)"><v-icon size="15">mdi-play</v-icon>{{ prog.ep ? '续播 第' + (prog.ep + 1) + ' 集' : '从头播放' }}</button>
                  <button class="vp-btn" @click="toggleFav()"><v-icon size="15">{{ isFav ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>{{ isFav ? '已收藏' : '收藏' }}</button>
                  <button class="vp-btn" @click="altOpen = !altOpen"><v-icon size="15">mdi-swap-horizontal</v-icon>换源<sub v-if="detail.alts && detail.alts.length">{{ detail.alts.length }}</sub></button>
                  <button class="vp-btn" @click="toggleFallback()"><v-icon size="15">mdi-television-classic</v-icon>{{ useFallback ? '直连播放' : '备用线路' }}</button>
                </div>
              </div>
            </div>
          </div>

          <transition name="vp-drop">
            <div v-if="altOpen && detail.alts && detail.alts.length" class="vp-alts">
              <div class="vp-alts-t"><v-icon size="13">mdi-swap-horizontal</v-icon>选择线路（按画质/集数自选）</div>
              <button v-for="(a, i) in detail.alts" :key="i" class="vp-alt" @click="useAlt(a)">
                <span class="vp-alt-src">{{ a.src }}</span>
                <span class="vp-alt-meta">{{ a.epCount }} 集<template v-if="a.maxRes"> · {{ a.maxRes }}</template></span>
                <span class="vp-alt-go">切换<v-icon size="12">mdi-chevron-right</v-icon></span>
              </button>
            </div>
          </transition>

          <div class="vp-player-wrap">
            <video v-show="!useFallback" ref="videoEl" class="vp-video" controls playsinline
                     @ended="onEnded" @play="playing = true" @pause="playing = false"
                     @dblclick="toggleFs"></video>
            <div v-if="!useFallback && curEp" class="vp-pctl">
              <button class="vp-pbtn" :disabled="curIdx <= 0" title="上一集" @click="prevEp"><v-icon size="16">mdi-skip-previous</v-icon></button>
              <button class="vp-pbtn" :title="playing ? '暂停' : '播放'" @click="togglePlay"><v-icon size="18">{{ playing ? 'mdi-pause' : 'mdi-play' }}</v-icon></button>
              <button class="vp-pbtn" :disabled="curIdx >= detail.eps.length - 1" title="下一集" @click="nextEp"><v-icon size="16">mdi-skip-next</v-icon></button>
              <button class="vp-pbtn" title="全屏" @click="toggleFs"><v-icon size="16">mdi-fullscreen</v-icon></button>
              <button class="vp-pbtn wide" title="选集" @click="epDrawer = !epDrawer">
                <v-icon size="14">mdi-format-list-numbered</v-icon>{{ curIdx + 1 }}/{{ detail.eps.length }}
              </button>
            </div>
            <transition name="vp-drop">
              <div v-if="epDrawer && !useFallback" class="vp-drawer">
                <div class="vp-drawer-t">选集<button class="vp-drawer-x" @click="epDrawer = false"><v-icon size="13">mdi-close</v-icon></button></div>
                <div class="vp-drawer-grid">
                  <button v-for="(e, i) in detail.eps" :key="i" :class="['vp-drawer-ep', { on: i === curIdx }]"
                          @click="playEp(i); epDrawer = false">{{ e.name }}</button>
                </div>
              </div>
            </transition>
            <iframe v-show="useFallback && fallbackSrc" class="vp-frame" :src="fallbackSrc" allow="autoplay; encrypted-media; fullscreen" allowfullscreen referrerpolicy="no-referrer"></iframe>
            <div v-if="loadingEp" class="vp-loading"><div class="vp-spin"></div><p>{{ loadMsg }}</p></div>
            <transition name="vp-drop">
              <div v-if="nextCount > 0" class="vp-next">
                <p>下一集 <b>{{ nextCount }}</b> 秒后自动播放</p>
                <div class="vp-err-btns">
                  <button class="vp-btn primary" @click="nextNow">立即播放</button>
                  <button class="vp-btn" @click="nextCount = 0">取消</button>
                </div>
              </div>
            </transition>
            <transition name="vp-drop">
              <div v-if="playErr" class="vp-err">
                <p>{{ playErr }}</p>
                <div class="vp-err-btns">
                  <button class="vp-btn primary" @click="recoverPlay()"><v-icon size="14">mdi-auto-fix</v-icon>自动恢复</button>
                  <button class="vp-btn" @click="switchSource()"><v-icon size="14">mdi-swap-horizontal</v-icon>换源</button>
                </div>
              </div>
            </transition>
          </div>

          <div class="vp-ctl">
            <div class="vp-now">
              <span v-if="curEp">▶ {{ curEp.name }}</span>
              <template v-if="detail.eps.length > 1">
                <button class="vp-mini" :disabled="curIdx <= 0" @click="playEp(curIdx - 1)"><v-icon size="13">mdi-skip-previous</v-icon></button>
                <button class="vp-mini" :disabled="curIdx >= detail.eps.length - 1" @click="playEp(curIdx + 1)"><v-icon size="13">mdi-skip-next</v-icon></button>
              </template>
              <label class="vp-auto"><input type="checkbox" v-model="autoNext" /> 自动连播</label>
            </div>
            <div class="vp-now">
              <span class="vp-qwrap">
                <button v-for="(r, i) in rates" :key="i" :class="['vp-qchip', { on: rate === r }]" @click="setRate(r)">{{ r }}x</button>
              </span>
              <span v-if="qualities.length" class="vp-qwrap">
                <button v-for="(q, i) in qualities" :key="'q' + i" :class="['vp-qchip', { on: i === curLevel }]" @click="setLevel(i)">{{ q }}</button>
              </span>
            </div>
          </div>

          <div class="vp-eps">
            <button v-for="(e, i) in detail.eps" :key="i" :class="['vp-ep', { on: i === curIdx }]" @click="playEp(i, true)">{{ e.name }}</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'VideoPage',
  data() {
    return {
      visible: false, xs: false,
      view: 'home',
      kw: '', lastKw: '', searched: false, searching: false, results: [],
      sugList: [], sugOpen: false, _sugTimer: null,
      homeRows: [], homeTypes: [], homeLoading: false,
      listKw: '', listTitle: '', listItems: [], listPage: 0, listHasMore: true, listLoading: false,
      recent: [], bestSrc: '', favs: [], prog: { ep: 0, t: 0 },
      toast: '', _toastTimer: null,
      rates: [0.75, 1, 1.25, 1.5, 2], rate: 1, autoNext: true,
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
      vipUrl: '', vipLine: null, vipSrc: '',
      detail: null, curIdx: -1, curEp: null, nextEp: -1,
      useFallback: false, fallbackSrc: '',
      loadingEp: false, loadMsg: '', playErr: '',
      qualities: [], curLevel: -1,
      _hls: null, _retriedLevel: false, _progTimer: 0, _lastProgPush: 0,
      altOpen: false, nextCount: 0, nextTimer: null, _epTimer: 0, _keyHandler: null,
      playing: false, epDrawer: false, autoFs: true,
    };
  },
  computed: {
    isFav() { return this.detail ? this.favs.some((f) => f.name === this.detail.name) : false; },
  },
  mounted() {
    const sync = () => { this.xs = window.innerWidth < 700; };
    this._keyHandler = (e) => {
      if (!this.visible || this.view !== 'detail' || !this.detail) return;
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const v = this.$refs.videoEl;
      if (e.key === 'ArrowRight' && this.curIdx < this.detail.eps.length - 1) { e.preventDefault(); this.playEp(this.curIdx + 1); }
      else if (e.key === 'ArrowLeft' && this.curIdx > 0) { e.preventDefault(); this.playEp(this.curIdx - 1); }
      else if (e.key === ' ' && v) { e.preventDefault(); if (v.paused) { v.play(); } else { v.pause(); } }
    };
    window.addEventListener('keydown', this._keyHandler);
    sync();
    try { window.addEventListener('resize', sync); } catch (e) {}
    try {
      this.bestSrc = localStorage.getItem('wb_video_src') || '';
      this.recent = JSON.parse(localStorage.getItem('wb_video_recent') || '[]');
      this.favs = JSON.parse(localStorage.getItem('wb_video_fav') || '[]');
    } catch (e) {}
  },
  methods: {
    open() { this.visible = true; if (!this.homeRows.length) this.loadHome(); this.syncAll(); },
    // ---------- 账号同步（收藏/进度） ----------
    authToken() { try { return localStorage.getItem('disease_token') || ''; } catch (e) { return ''; } },
    async syncAll() {
      const t = this.authToken();
      if (!t) return;
      try {
        const r = await fetch('/api/video/sync', { headers: { Authorization: 'Bearer ' + t } });
        if (!r.ok) return;
        const d = await r.json();
        if (!d.logged_in) return;
        // 合并收藏：服务端优先，本地独有的补传
        const serverNames = new Set((d.favs || []).map((f) => f.name));
        const localOnly = this.favs.filter((f) => !serverNames.has(f.name));
        this.favs = (d.favs || []).concat(localOnly).slice(0, 60);
        localOnly.forEach((f) => this.pushFav(f, true));
        try { localStorage.setItem('wb_video_fav', JSON.stringify(this.favs)); } catch (e) {}
        // 合并进度：服务端优先，本地独有的补传
        try {
          const local = JSON.parse(localStorage.getItem('wb_video_prog') || '{}');
          const merged = Object.assign({}, local, d.prog || {});
          localStorage.setItem('wb_video_prog', JSON.stringify(merged));
          Object.keys(local).forEach((k) => { if (!(d.prog || {})[k]) this.pushProgRaw(k, local[k]); });
        } catch (e) {}
      } catch (e) {}
    },
    pushFav(f, on) {
      const t = this.authToken();
      if (!t) return;
      fetch('/api/video/fav', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t },
        body: JSON.stringify({ name: f.name, src: f.src || '', vod_id: f.id || f.vod_id || '', pic: f.pic || '', on: !!on }) }).catch(() => {});
    },
    pushProgRaw(name, pr) {
      const t = this.authToken();
      if (!t || !pr) return;
      fetch('/api/video/prog', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t },
        body: JSON.stringify({ name, src: pr.src || '', vod_id: pr.id || '', pic: pr.pic || '', ep: pr.ep || 0, pos: pr.t || 0 }) }).catch(() => {});
    },
    close() { this.visible = false; this.stopPlay(); },
    showToast(msg, ms) {
      this.toast = msg;
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => { this.toast = ''; }, ms || 3200);
    },
    async fetchJSON(url, tries) {
      const n = tries || 3;
      let lastErr = null;
      for (let i = 0; i < n; i++) {
        try {
          const r = await fetch(url);
          if (!r.ok) { let m = 'HTTP ' + r.status; try { const j = await r.json(); m = (j.detail && (j.detail.message || j.detail)) || m; } catch (e) {} throw new Error(m); }
          return await r.json();
        } catch (e) { lastErr = e; if (i < n - 1) await new Promise((res) => setTimeout(res, 500 * (i + 1))); }
      }
      throw lastErr || new Error('请求失败');
    },
    // ---------- 首页 ----------
    async loadHome(force) {
      if (this.homeRows.length && !force) return;
      // 秒开：先用上次本地缓存渲染，再后台刷新（首屏 0ms 出内容）
      if (!force && !this.homeRows.length) {
        try {
          const cached = JSON.parse(sessionStorage.getItem('wb_video_home') || 'null');
          if (cached && cached.rows && cached.rows.length) {
            this.homeRows = cached.rows;
            this.homeTypes = cached.homeTypes || [];
          }
        } catch (e) {}
      }
      if (!this.homeRows.length) this.homeLoading = true;
      try {
        const d = await this.fetchJSON('/api/video/home');
        this.homeRows = d.rows || [];
        this.homeTypes = d.homeTypes || [];
        try { sessionStorage.setItem('wb_video_home', JSON.stringify({ rows: this.homeRows, homeTypes: this.homeTypes })); } catch (e) {}
      } catch (e) {
        if (!this.homeRows.length) {
          this.homeRows = [];
          this.showToast('首页加载失败，可点「重新加载」');
        }
      }
      this.homeLoading = false;
    },
    goHome() { this.view = 'home'; this.stopPlay(); },
    // ---------- 搜索 ----------
    onInput() {
      clearTimeout(this._sugTimer);
      const kw = (this.kw || '').trim();
      if (kw.length < 1) { this.sugList = []; this.sugOpen = false; return; }
      this._sugTimer = setTimeout(async () => {
        try {
          const d = await this.fetchJSON('/api/video/suggest?kw=' + encodeURIComponent(kw), 2);
          this.sugList = d.list || [];
          this.sugOpen = this.sugList.length > 0;
        } catch (e) { this.sugList = []; }
      }, 260);
    },
    closeSugSoon() { setTimeout(() => { this.sugOpen = false; }, 160); },
    quickSearch(w) { this.kw = w; this.sugOpen = false; this.doSearch(); },
    remember(kw) {
      this.recent = [kw].concat(this.recent.filter((x) => x !== kw)).slice(0, 6);
      try { localStorage.setItem('wb_video_recent', JSON.stringify(this.recent)); } catch (e) {}
    },
    clearRecent() { this.recent = []; try { localStorage.removeItem('wb_video_recent'); } catch (e) {} },
    async doSearch() {
      const kw = (this.kw || '').trim();
      if (!kw || this.searching) return;
      this.searching = true; this.searched = true; this.lastKw = kw; this.sugOpen = false;
      this.view = 'search'; this.stopPlay();
      try {
        const j = await this.fetchJSON('/api/video/search?kw=' + encodeURIComponent(kw));
        let list = j.list || [];
        if (this.bestSrc) list = list.slice().sort((a, b) => (b.src === this.bestSrc) - (a.src === this.bestSrc));
        this.results = list;
        this.remember(kw);
      } catch (e) { this.results = []; this.showToast('搜索失败，可点「再试一次」'); }
      this.searching = false;
    },
    // ---------- 分类列表 ----------
    async openList(t) {
      this.view = 'list';
      this.listKw = t.id || '';
      this.listTitle = t.name || '全部';
      this.listItems = []; this.listPage = 0; this.listHasMore = true;
      this.stopPlay();
      await this.loadMore();
    },
    async loadMore() {
      if (this.listLoading) return;
      this.listLoading = true;
      const page = this.listPage + 1;
      try {
        const d = await this.fetchJSON('/api/video/list?kw=' + encodeURIComponent(this.listKw) + '&page=' + page + '&size=24');
        const items = d.items || [];
        const seen = new Set(this.listItems.map((x) => x.id + x.src));
        this.listItems = this.listItems.concat(items.filter((x) => !seen.has(x.id + x.src)));
        this.listPage = page;
        this.listHasMore = !!d.hasMore && items.length > 0;
      } catch (e) {
        this.showToast('加载失败，稍后再试');
        this.listHasMore = false;
      }
      this.listLoading = false;
    },
    // ---------- 详情 ----------
    openDetailCheat(f) { this.openDetail({ id: f.id, name: f.name, src: f.src, pic: f.pic }); },
    async openDetail(r) {
      this.stopPlay();
      this.view = 'detail';
      this.loadingEp = false; this.playErr = '';
      try {
        const d = await this.fetchJSON('/api/video/detail?id=' + encodeURIComponent(r.id) + '&src=' + encodeURIComponent(r.src || '主源') + '&fallback=1');
        if (!d.eps || !d.eps.length) { this.showToast('这部暂时没有可播剧集，换一部试试'); return; }
        this.detail = d;
        this.curIdx = -1; this.curEp = null; this.useFallback = false; this.fallbackSrc = '';
        this.qualities = []; this.curLevel = -1;
        if (d.recovered) this.showToast('原线路没资源，已自动切换到「' + d.src + '」线路');
        this.bestSrc = d.src;
        try { localStorage.setItem('wb_video_src', d.src); } catch (e) {}
        // 异步补充：画质 + 换源候选（不阻塞首屏）
        this.fillExtra(d);
        try {
          const all = JSON.parse(localStorage.getItem('wb_video_prog') || '{}');
          this.prog = all[d.name] || { ep: 0, t: 0 };
        } catch (e) { this.prog = { ep: 0, t: 0 }; }
      } catch (e) { this.showToast((e && e.message) || '加载详情失败'); }
    },
    async fillExtra(d) {
      try {
        const ex = await this.fetchJSON('/api/video/extra?id=' + encodeURIComponent(d.id) + '&src=' + encodeURIComponent(d.src || '主源') + '&name=' + encodeURIComponent(d.name), 2);
        if (this.detail && this.detail.id === d.id) {
          this.detail.maxRes = ex.maxRes || '';
          this.detail.alts = ex.alts || [];
        }
      } catch (e) {}
    },
    prefetch(r) {
      if (!r || !r.id) return;
      try { fetch('/api/video/detail?id=' + encodeURIComponent(r.id) + '&src=' + encodeURIComponent(r.src || '主源') + '&fallback=1').catch(() => {}); } catch (e) {}
    },
    saveProg(force) {
      if (!this.detail || this.curIdx < 0) return;
      try {
        const all = JSON.parse(localStorage.getItem('wb_video_prog') || '{}');
        all[this.detail.name] = { ep: this.curIdx, t: Math.floor((this.$refs.videoEl && this.$refs.videoEl.currentTime) || 0), src: this.detail.src, id: this.detail.id, pic: this.detail.pic };
        const keys = Object.keys(all);
        if (keys.length > 30) delete all[keys[0]];
        localStorage.setItem('wb_video_prog', JSON.stringify(all));
        const now = Date.now();
        if (force || now - (this._lastProgPush || 0) > 10000) {
          this._lastProgPush = now;
          this.pushProgRaw(this.detail.name, { src: this.detail.src, id: this.detail.id, pic: this.detail.pic, ep: this.curIdx, t: Math.floor((this.$refs.videoEl && this.$refs.videoEl.currentTime) || 0) });
        }
      } catch (e) {}
    },
    toggleFav() {
      if (!this.detail) return;
      const i = this.favs.findIndex((f) => f.name === this.detail.name);
      if (i >= 0) { const gone = this.favs[i]; this.favs.splice(i, 1); this.showToast('已取消收藏'); this.pushFav(gone, false); }
      else {
        this.favs.unshift({ name: this.detail.name, id: this.detail.id, src: this.detail.src, pic: this.detail.pic });
        this.showToast('已收藏，首页可见');
        this.pushFav(this.favs[0], true);
      }
      this.favs = this.favs.slice(0, 30);
      try { localStorage.setItem('wb_video_fav', JSON.stringify(this.favs)); } catch (e) {}
    },
    useAlt(a) {
      this.altOpen = false;
      this.showToast('正在切到「' + a.src + '」' + (a.maxRes ? '（' + a.maxRes + '）' : ''));
      this.openDetail({ id: a.id, name: a.name, src: a.src, pic: a.pic });
    },
    epKey(name, i) { return 'wb_video_ep:' + name + ':' + i; },
    saveEpPos() {
      if (!this.detail || this.curIdx < 0) return;
      const v = this.$refs.videoEl;
      if (!v) return;
      const now = Date.now();
      if (now - (this._epTimer || 0) < 5000) return;
      this._epTimer = now;
      try { localStorage.setItem(this.epKey(this.detail.name, this.curIdx), String(Math.floor(v.currentTime || 0))); } catch (e) {}
      this.saveProg();
    },
    switchSource() {
      if (!this.detail) return;
      const pool = this.results.length ? this.results : this.listItems;
      const others = (pool || []).filter((x) => x.name === this.detail.name && x.src !== this.detail.src);
      if (!others.length) { this.showToast('没有别的线路了，可用备用线路播'); return; }
      this.showToast('正在换到「' + others[0].src + '」…');
      this.openDetail(others[0]);
    },
    toggleFallback() {
      this.useFallback = !this.useFallback;
      if (this.useFallback && !this.fallbackSrc && this.curEp) {
        this.fallbackSrc = 'https://wsyzy.vip/m3u8/?url=' + encodeURIComponent(this.curEp.url);
      }
    },
    stopPlay() {
      if (this.nextTimer) { clearInterval(this.nextTimer); this.nextTimer = null; }
      this.nextCount = 0;
      try { if (this._hls) { this._hls.destroy(); this._hls = null; } } catch (e) {}
      const v = this.$refs.videoEl;
      if (v) { try { v.pause(); v.removeAttribute('src'); v.load(); } catch (e) {} }
    },
    async playEp(i, userGesture) {
      if (!this.detail || !this.detail.eps[i]) return;
      if (this.nextTimer) { clearInterval(this.nextTimer); this.nextTimer = null; }
      this.nextCount = 0;
      this.curIdx = i;
      this.curEp = this.detail.eps[i];
      this.playErr = ''; this.useFallback = false; this.fallbackSrc = '';
      this._retriedLevel = false;
      this.loadingEp = true; this.loadMsg = '正在建立直连…';
      await this.$nextTick();
      const ok = await this.nativePlay(this.curEp.url, true);
      this.loadingEp = false;
      if (!ok) this.playErr = '直连没能播放（片源可能限制跨域）';
      this.saveProg(true);
      if (userGesture && this.autoFs) {
        // 用户点击播放 → 直接全屏（市面播放器习惯）
        try {
          const wrap = this.$el && this.$el.querySelector('.vp-player-wrap');
          if (wrap && wrap.requestFullscreen) wrap.requestFullscreen().catch(() => {});
        } catch (e) {}
      }
    },
    onEnded() {
      if (!this.detail) return;
      this.saveProg(true);
      if (this.autoNext && this.curIdx < this.detail.eps.length - 1) {
        this.nextEp = this.curIdx + 1;
        this.nextCount = 3;
        if (this.nextTimer) clearInterval(this.nextTimer);
        this.nextTimer = setInterval(() => {
          this.nextCount -= 1;
          if (this.nextCount <= 0) {
            clearInterval(this.nextTimer);
            this.nextTimer = null;
            this.playEp(this.nextEp);
          }
        }, 1000);
      }
    },
    nextNow() {
      if (this.nextTimer) { clearInterval(this.nextTimer); this.nextTimer = null; }
      this.nextCount = 0;
      if (this.nextEp >= 0) this.playEp(this.nextEp);
    },
    playerEl() {
      const v = this.$refs.videoEl;
      return v || null;
    },
    togglePlay() {
      const v = this.playerEl();
      if (!v) return;
      if (v.paused) { v.play().catch(() => {}); } else { v.pause(); }
    },
    prevEp() { if (this.curIdx > 0) this.playEp(this.curIdx - 1); },
    nextEp() { if (this.detail && this.curIdx < this.detail.eps.length - 1) this.playEp(this.curIdx + 1); },
    toggleFs() {
      const wrap = this.$el && this.$el.querySelector('.vp-player-wrap');
      try {
        if (document.fullscreenElement) { document.exitFullscreen(); return; }
        if (wrap && wrap.requestFullscreen) wrap.requestFullscreen().catch(() => {});
        else if (this.playerEl() && this.playerEl().webkitEnterFullscreen) this.playerEl().webkitEnterFullscreen();
      } catch (e) {}
    },
    setRate(r) {
      this.rate = r;
      const v = this.$refs.videoEl;
      if (v) v.playbackRate = r;
    },
    async nativePlay(url, isSwitch) {
      const v = this.$refs.videoEl;
      if (!v || !url) return false;
      // 无缝切集：复用 hls 实例（不重建播放器、不黑屏）
      if (isSwitch && this._hls && this._hls.media === v) {
        try {
          this._hls.loadSource(url);
          v.playbackRate = this.rate;
          v.play().catch(() => {});
          this.$nextTick(() => { try { v.currentTime = this.getEpPos(); } catch (e) {} });
          return true;
        } catch (e) {}
      }
      try { if (this._hls) { this._hls.destroy(); this._hls = null; } } catch (e) {}
      const isM3u8 = /\.m3u8(\?|$)/i.test(url);
      if (isM3u8 && v.canPlayType('application/vnd.apple.mpegurl') && !window.MediaSource) {
        v.src = url; v.playbackRate = this.rate; v.play().catch(() => {}); return true;
      }
      if (isM3u8) {
        try {
          const mod = await import('hls.js');
          const Hls = mod.default || mod.Hls;
          if (Hls && Hls.isSupported()) {
            const hls = new Hls({ maxBufferLength: 40, manifestLoadingTimeOut: 15000, fragLoadingMaxRetry: 4 });
            this._hls = hls;
            this.qualities = []; this.curLevel = -1;
            hls.on(Hls.Events.MANIFEST_PARSED, (e, d) => {
              const lv = (d && d.levels) || hls.levels || [];
              this.qualities = lv.map((l) => (l.height ? l.height + 'P' : Math.round((l.bitrate || 0) / 1000) + 'k'));
              if (lv.length > 1) { hls.currentLevel = lv.length - 1; this.curLevel = lv.length - 1; }
              else if (lv.length === 1) this.curLevel = 0;
            });
            hls.on(Hls.Events.LEVEL_SWITCHED, (e, d) => { this.curLevel = d.level; });
            hls.on(Hls.Events.ERROR, (e, data) => {
              if (!data || !data.fatal) return;
              if (!this._retriedLevel) {
                this._retriedLevel = true;
                try { if (this.curLevel > 0) hls.currentLevel = 0; hls.startLoad(); this.showToast('直连不稳，已自动降低清晰度重试'); return; } catch (err) {}
              }
              this.fallbackSrc = 'https://wsyzy.vip/m3u8/?url=' + encodeURIComponent(url);
              this.playErr = '直连播放失败，已准备好备用线路';
            });
            hls.loadSource(url);
            hls.attachMedia(v);
            v.playbackRate = this.rate;
            v.play().catch(() => {});
            v.addEventListener('timeupdate', () => this.saveEpPos());
            this.$nextTick(() => { try { v.currentTime = this.getEpPos(); } catch (e) {} });
            return true;
          }
        } catch (e) {}
      }
      try { v.src = url; v.playbackRate = this.rate; v.play().catch(() => {}); return true; } catch (e) { return false; }
    },
    getEpPos() {
      try {
        const k = this.epKey(this.detail.name, this.curIdx);
        const s = parseInt(localStorage.getItem(k) || '0', 10);
        return (s > 5 && s < 86400) ? s : 0;
      } catch (e) { return 0; }
    },
    recoverPlay() {
      this.playErr = '';
      if (this.curEp && !this.fallbackSrc) this.fallbackSrc = 'https://wsyzy.vip/m3u8/?url=' + encodeURIComponent(this.curEp.url);
      if (this.fallbackSrc) { this.useFallback = true; this.showToast('已切到备用线路播放'); return; }
      this.switchSource();
    },
    setLevel(i) { if (this._hls) { this._hls.currentLevel = i; this.curLevel = i; } },
    pickLine(l) { this.vipLine = l; if (this.vipUrl.trim()) this.playVip([this.vipUrl]); },
    playVip(urls) {
      const line = this.vipLine || this.lines[0];
      this.vipLine = line;
      const target = (urls && urls[0]) || this.vipUrl;
      if (!target) return;
      this.vipSrc = line.url + encodeURIComponent(target.trim());
    },
  },
  watch: {
    visible(v) {
      if (!v) this.stopPlay();
    },
  },
};
</script>

<style scoped>
.vp-mask { position: fixed; inset: 0; z-index: 2350; display: flex; align-items: center; justify-content: center; background: rgba(4, 7, 18, .82); backdrop-filter: blur(12px); }
.vp-shell { position: relative; width: min(1120px, 96vw); height: min(780px, 94vh); overflow: hidden; border-radius: 22px; display: flex; flex-direction: column;
  background: radial-gradient(1200px 520px at 10% -10%, #17203a 0%, #0b1020 45%, #06080f 100%);
  border: 1px solid rgba(120, 160, 255, .18); box-shadow: 0 30px 90px rgba(0, 0, 0, .68), inset 0 1px 0 rgba(255, 255, 255, .06); }
.vp-shell.is-full { width: 100vw; height: 100vh; border-radius: 0; }
.vp-aurora { position: absolute; inset: 0; pointer-events: none; opacity: .5; }
.vp-aurora i { position: absolute; border-radius: 50%; filter: blur(72px); }
.vp-aurora .a1 { width: 350px; height: 350px; left: -100px; top: -130px; background: rgba(56, 189, 248, .3); }
.vp-aurora .a2 { width: 310px; height: 310px; right: -90px; top: 18%; background: rgba(217, 70, 239, .22); }
.vp-aurora .a3 { width: 310px; height: 310px; left: 34%; bottom: -150px; background: rgba(250, 204, 21, .13); }

.vp-head { position: relative; z-index: 3; display: flex; align-items: center; gap: 12px; padding: 15px 20px 8px; }
.vp-back { width: 32px; height: 32px; border-radius: 10px; border: 1px solid rgba(148, 163, 184, .3); background: rgba(255, 255, 255, .06); color: #cbd5e1; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.vp-back:hover { border-color: #38bdf8; color: #e0f2fe; }
.vp-brand { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.vp-logo { font-size: 25px; filter: drop-shadow(0 0 12px rgba(250, 204, 21, .6)); }
.vp-title { font-size: 17.5px; font-weight: 900; background: linear-gradient(90deg, #7dd3fc, #e879f9 55%, #fde68a); -webkit-background-clip: text; background-clip: text; color: transparent; }
.vp-sub { font-size: 11px; font-weight: 600; color: #8b9cc7; margin-left: 6px; -webkit-text-fill-color: #8b9cc7; }
.vp-note { font-size: 10.5px; color: #61708f; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.vp-tab { border: 1px solid rgba(125, 211, 252, .25); background: rgba(125, 211, 252, .08); color: #bae6fd; font-size: 12.5px; font-weight: 700; padding: 7px 14px; border-radius: 999px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; }
.vp-tab.on { background: linear-gradient(120deg, #0ea5e9, #8b5cf6); color: #fff; border-color: transparent; box-shadow: 0 6px 18px rgba(56, 189, 248, .35); }
.vp-x { width: 33px; height: 33px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, .12); background: rgba(255, 255, 255, .06); color: #cbd5e1; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.vp-x:hover { background: rgba(244, 63, 94, .2); color: #fda4af; }

.vp-toast { position: relative; z-index: 3; margin: 0 20px 6px; display: flex; align-items: center; gap: 6px; font-size: 12px; color: #d9f99d;
  background: linear-gradient(90deg, rgba(132, 204, 22, .16), rgba(34, 197, 94, .1)); border: 1px solid rgba(163, 230, 53, .4); border-radius: 10px; padding: 7px 12px; }
.vp-drop-enter-active, .vp-drop-leave-active { transition: all .25s; }
.vp-drop-enter-from, .vp-drop-leave-to { opacity: 0; transform: translateY(-8px); }

.vp-body { position: relative; z-index: 1; flex: 1; overflow-y: auto; padding: 6px 20px 22px; }
.vp-body.detail { padding: 0 20px 24px; }

.vp-searchwrap { position: relative; z-index: 6; }
.vp-search { display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, .05); border: 1.5px solid rgba(125, 211, 252, .22); border-radius: 999px; padding: 4px 6px 4px 14px; transition: all .25s; }
.vp-search:focus-within { border-color: #38bdf8; box-shadow: 0 0 0 4px rgba(56, 189, 248, .14), 0 0 26px rgba(56, 189, 248, .22); }
.vp-search-ico { color: #7dd3fc; }
.vp-input { flex: 1; background: transparent; border: none; outline: none; color: #e2e8f0; font-size: 14px; padding: 10px 4px; min-width: 0; }
.vp-input::placeholder { color: #5b6b8c; }
.vp-go { border: none; border-radius: 999px; padding: 10px 22px; font-size: 13.5px; font-weight: 800; cursor: pointer; flex: none; color: #041024; background: linear-gradient(120deg, #7dd3fc, #a78bfa); box-shadow: 0 6px 20px rgba(125, 211, 252, .35); }
.vp-go:disabled { opacity: .5; cursor: not-allowed; }
.vp-sug { position: absolute; left: 0; right: 0; top: calc(100% + 6px); background: #101728; border: 1px solid rgba(125, 211, 252, .25); border-radius: 14px; overflow: hidden; box-shadow: 0 18px 40px rgba(0, 0, 0, .55); }
.vp-sug button { display: flex; align-items: center; gap: 8px; width: 100%; text-align: left; background: transparent; border: none; color: #cbd5e1; font-size: 13px; padding: 10px 14px; cursor: pointer; }
.vp-sug button:hover { background: rgba(56, 189, 248, .12); color: #e0f2fe; }

.vp-chips { display: flex; gap: 7px; flex-wrap: wrap; margin: 12px 2px 4px; }
.vp-chip { border: 1px solid rgba(148, 163, 184, .28); background: rgba(255, 255, 255, .04); color: #b6c2d9; font-size: 12.5px; padding: 6px 15px; border-radius: 999px; cursor: pointer; transition: all .18s; }
.vp-chip:hover { border-color: #38bdf8; color: #e0f2fe; background: rgba(56, 189, 248, .1); }

.vp-hot { display: flex; align-items: center; gap: 8px; margin: 10px 2px 0; overflow: hidden; }
.vp-hot-t { font-size: 11px; color: #64748b; flex: none; }
.vp-hot-c { border: 1px dashed rgba(148, 163, 184, .4); background: transparent; color: #94a3b8; font-size: 12px; padding: 3px 10px; border-radius: 999px; cursor: pointer; flex: none; }
.vp-hot-c:hover { color: #7dd3fc; border-color: #38bdf8; }
.vp-hot-c.clear { padding: 3px 7px; }

.vp-row { margin-top: 16px; }
.vp-rowhead { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.vp-rowtitle { font-size: 14px; font-weight: 800; color: #e2e8f0; }
.vp-rowtitle.sk-anim { width: 120px; height: 14px; border-radius: 6px; background: #131b2f; }
.vp-more { border: none; background: transparent; color: #7dd3fc; font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; }
.vp-btn sub { font-size: 9px; margin-left: 2px; opacity: .8; }
.vp-more:hover { color: #e0f2fe; }
.vp-rail { display: flex; gap: 12px; overflow-x: auto; padding: 4px 2px 10px; scroll-behavior: smooth; }
.vp-rail::-webkit-scrollbar { height: 6px; }
.vp-rail::-webkit-scrollbar-thumb { background: rgba(125, 211, 252, .3); border-radius: 3px; }
.vp-card.rail { flex: none; width: 118px; }
.vp-mini { flex: none; width: 118px; aspect-ratio: 2/3; border-radius: 12px; background: #131b2f; }
.vp-rowload { margin-top: 16px; }

.vp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 14px; margin-top: 14px; }
.vp-card { cursor: pointer; transition: transform .22s cubic-bezier(.2, .8, .2, 1.2); }
.vp-card:hover { transform: translateY(-5px) scale(1.03); }
.vp-poster { position: relative; width: 100%; aspect-ratio: 2/3; border-radius: 12px; background: #101830 center/cover no-repeat; border: 1px solid rgba(148, 163, 184, .16); overflow: hidden; display: flex; align-items: center; justify-content: center; }
.vp-card:hover .vp-poster { border-color: rgba(56, 189, 248, .65); box-shadow: 0 10px 30px rgba(56, 189, 248, .3); }
.vp-grad { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 48%, rgba(2, 6, 23, .8)); }
.vp-play-ico { position: relative; opacity: 0; transform: scale(.85); transition: all .22s; color: #fff; filter: drop-shadow(0 2px 10px rgba(0, 0, 0, .7)); }
.vp-card:hover .vp-play-ico { opacity: 1; transform: scale(1); }
.vp-noimg { position: relative; font-size: 11px; color: #475569; }
.vp-rem { position: absolute; right: 6px; bottom: 6px; font-size: 10px; color: #d1fae5; background: rgba(2, 6, 23, .75); border-radius: 5px; padding: 1px 5px; max-width: 86%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.vp-src { position: absolute; top: 6px; left: 6px; font-size: 10px; color: #e0f2fe; background: rgba(2, 6, 23, .72); border: 1px solid rgba(125, 211, 252, .4); border-radius: 6px; padding: 1px 6px; backdrop-filter: blur(4px); max-width: 78%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.vp-src.star { color: #fde68a; border-color: rgba(253, 230, 138, .55); }
.vp-line { margin-top: 7px; font-size: 12.5px; color: #cbd5e1; text-align: center; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.vp-line.bar { height: 10px; margin: 8px auto 0; width: 70%; border-radius: 6px; background: #131b2f; }
.sk-anim { animation: vp-pulse 1.2s ease-in-out infinite; }
@keyframes vp-pulse { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }

.vp-lhead { display: flex; align-items: baseline; gap: 10px; margin: 6px 2px 2px; }
.vp-ltitle { font-size: 15px; font-weight: 800; color: #f1f5f9; }
.vp-lcount { font-size: 11.5px; color: #64748b; }
.vp-morewrap { text-align: center; margin-top: 18px; }
.vp-end { font-size: 12px; color: #475569; }

.vp-empty { text-align: center; color: #64748b; padding: 40px 0; }
.vp-empty p { margin-top: 12px; font-size: 13.5px; line-height: 1.8; color: #94a3b8; }
.vp-empty small { color: #5b6b8c; font-size: 11.5px; }
.vp-empty .vp-btn { margin-top: 12px; }
.vp-empty-orb { display: inline-flex; align-items: center; justify-content: center; width: 74px; height: 74px; border-radius: 50%;
  background: radial-gradient(circle at 32% 28%, rgba(56, 189, 248, .28), rgba(139, 92, 246, .12)); color: #7dd3fc; border: 1px solid rgba(125, 211, 252, .28); }
.vp-empty-orb.soft { background: radial-gradient(circle at 32% 28%, rgba(250, 204, 21, .22), rgba(236, 72, 153, .1)); color: #fcd34d; border-color: rgba(250, 204, 21, .28); }
.vp-empty.small { padding: 26px 0; }

.vp-tip { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #93a4c4; background: rgba(56, 189, 248, .07); border: 1px dashed rgba(56, 189, 248, .3); border-radius: 12px; padding: 10px 12px; margin-bottom: 12px; }
.vp-lines { display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0; }
.vp-line-chip { border: 1px solid rgba(148, 163, 184, .28); background: rgba(255, 255, 255, .04); color: #94a3b8; font-size: 12px; padding: 5px 12px; border-radius: 999px; cursor: pointer; transition: all .18s; }
.vp-line-chip:hover { color: #e2e8f0; border-color: #8b5cf6; }
.vp-line-chip.on { background: linear-gradient(120deg, #8b5cf6, #ec4899); color: #fff; border-color: transparent; box-shadow: 0 4px 14px rgba(139, 92, 246, .35); }

.vp-hero { position: relative; margin: 0 -20px 14px; padding: 16px 20px; background: #0d1424 center/cover no-repeat; }
.vp-hero-mask { position: absolute; inset: 0; backdrop-filter: blur(24px) brightness(.4); background: linear-gradient(90deg, rgba(7, 10, 20, .92), rgba(7, 10, 20, .4)); }
.vp-hero-in { position: relative; display: flex; gap: 16px; }
.vp-hero-poster { width: 112px; aspect-ratio: 2/3; border-radius: 12px; background: #101830 center/cover no-repeat; flex: none; border: 1px solid rgba(125, 211, 252, .3); box-shadow: 0 12px 34px rgba(0, 0, 0, .6); }
.vp-hero-info h3 { font-size: 19px; font-weight: 900; color: #f1f5f9; margin-bottom: 6px; }
.vp-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.vp-meta span { font-size: 11px; color: #a5b4fc; background: rgba(99, 102, 241, .18); border: 1px solid rgba(129, 140, 248, .35); padding: 2px 9px; border-radius: 999px; }
.vp-meta span.src { color: #6ee7b7; background: rgba(16, 185, 129, .14); border-color: rgba(52, 211, 153, .4); }
.vp-meta span.res { color: #fcd34d; background: rgba(250, 204, 21, .14); border-color: rgba(253, 224, 71, .45); font-weight: 800; }
.vp-alts { margin-bottom: 10px; background: rgba(16, 24, 40, .85); border: 1px solid rgba(125, 211, 252, .25); border-radius: 12px; padding: 10px 12px; }
.vp-alts-t { font-size: 11.5px; color: #93c5fd; display: flex; align-items: center; gap: 5px; margin-bottom: 8px; }
.vp-alt { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: rgba(255, 255, 255, .04); border: 1px solid rgba(148, 163, 184, .22); border-radius: 10px; padding: 8px 12px; margin-bottom: 6px; cursor: pointer; color: #cbd5e1; font-size: 12.5px; transition: all .16s; }
.vp-alt:hover { border-color: #38bdf8; background: rgba(56, 189, 248, .1); }
.vp-alt-src { font-weight: 800; color: #7dd3fc; }
.vp-alt-meta { color: #94a3b8; }
.vp-alt-go { margin-left: auto; color: #6ee7b7; display: inline-flex; align-items: center; font-size: 11.5px; }
.vp-next { position: absolute; right: 12px; bottom: 12px; background: rgba(2, 6, 23, .92); border: 1px solid rgba(125, 211, 252, .4); border-radius: 12px; padding: 10px 14px; color: #e0f2fe; font-size: 12.5px; z-index: 4; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 10px 30px rgba(0, 0, 0, .5); }
.vp-story { font-size: 12px; color: #94a3b8; line-height: 1.7; max-height: 62px; overflow: hidden; margin-bottom: 10px; }
.vp-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.vp-btn { display: inline-flex; align-items: center; gap: 5px; border: 1px solid rgba(148, 163, 184, .3); background: rgba(255, 255, 255, .05); color: #cbd5e1; font-size: 12.5px; font-weight: 700; padding: 8px 14px; border-radius: 10px; cursor: pointer; transition: all .18s; }
.vp-btn:hover { border-color: #38bdf8; color: #e0f2fe; }
.vp-btn.primary { background: linear-gradient(120deg, #0ea5e9, #8b5cf6); border-color: transparent; color: #fff; box-shadow: 0 6px 18px rgba(14, 165, 233, .35); }
.vp-btn:disabled { opacity: .55; cursor: not-allowed; }

.vp-player-wrap { position: relative; width: 100%; aspect-ratio: 16/9; background: #000; border-radius: 14px; overflow: hidden; border: 1px solid rgba(125, 211, 252, .25); box-shadow: 0 16px 44px rgba(0, 0, 0, .6), 0 0 0 1px rgba(139, 92, 246, .12) inset; }
.vp-video, .vp-frame { position: absolute; inset: 0; width: 100%; height: 100%; border: none; background: #000; }
.vp-loading { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; background: rgba(3, 6, 14, .38); color: #93c5fd; font-size: 13px; z-index: 3; }
.vp-err { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; background: rgba(24, 6, 14, .9); color: #fda4af; font-size: 13px; z-index: 3; padding: 20px; text-align: center; }
.vp-err-btns { display: flex; gap: 8px; }
.vp-spin { width: 34px; height: 34px; border-radius: 50%; border: 3px solid rgba(125, 211, 252, .25); border-top-color: #38bdf8; animation: vp-rot .8s linear infinite; }
@keyframes vp-rot { to { transform: rotate(360deg); } }

.vp-ctl { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin: 10px 2px 4px; }
.vp-now { font-size: 12.5px; color: #7dd3fc; display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.vp-mini { border: 1px solid rgba(125, 211, 252, .3); background: rgba(125, 211, 252, .08); color: #bae6fd; border-radius: 8px; padding: 3px 8px; cursor: pointer; display: inline-flex; align-items: center; }
.vp-mini:disabled { opacity: .4; cursor: not-allowed; }
.vp-auto { font-size: 11.5px; color: #94a3b8; display: inline-flex; align-items: center; gap: 4px; cursor: pointer; }
.vp-qwrap { display: inline-flex; gap: 4px; }
.vp-qchip { border: 1px solid rgba(125, 211, 252, .3); background: rgba(125, 211, 252, .08); color: #bae6fd; font-size: 11px; padding: 2px 8px; border-radius: 999px; cursor: pointer; }
.vp-qchip.on { background: linear-gradient(120deg, #0ea5e9, #8b5cf6); color: #fff; border-color: transparent; }
.vp-eps { display: grid; grid-template-columns: repeat(auto-fill, minmax(82px, 1fr)); gap: 7px; margin-top: 8px; }
.vp-ep { border: 1px solid rgba(148, 163, 184, .25); background: rgba(255, 255, 255, .04); color: #b6c2d9; font-size: 12px; padding: 7px 4px; border-radius: 9px; cursor: pointer; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; transition: all .16s; }
.vp-ep:hover { border-color: #38bdf8; color: #e0f2fe; }
.vp-ep.on { background: linear-gradient(120deg, #0ea5e9, #8b5cf6); color: #fff; border-color: transparent; box-shadow: 0 4px 14px rgba(56, 189, 248, .3); }

.vp-fade-enter-active, .vp-fade-leave-active { transition: opacity .22s; }
.vp-fade-enter-from, .vp-fade-leave-to { opacity: 0; }

@media (max-width: 700px) {
  .vp-head { flex-wrap: wrap; gap: 8px; }
  .vp-brand { width: auto; flex: 1; }
  .vp-note { display: none; }
  .vp-hero-in { flex-direction: column; align-items: center; text-align: center; }
  .vp-hero-poster { width: 92px; }
  .vp-actions { justify-content: center; }
  .vp-grid { grid-template-columns: repeat(auto-fill, minmax(94px, 1fr)); gap: 10px; }
  .vp-card.rail, .vp-mini { width: 96px; }
  .vp-ctl { flex-direction: column; align-items: flex-start; }
}

/* ============ 椰白主题（覆盖深色，保持播放器区域为深色） ============ */
.vp-shell { background: linear-gradient(160deg, #fdfaf3 0%, #f8f3e8 45%, #f4eee0 100%) !important;
  border: 1px solid rgba(180, 160, 120, .28) !important;
  box-shadow: 0 30px 80px rgba(90, 74, 44, .28), inset 0 1px 0 rgba(255, 255, 255, .9) !important; }
.vp-aurora { opacity: .5 !important; }
.vp-aurora .a1 { background: rgba(255, 196, 128, .35) !important; }
.vp-aurora .a2 { background: rgba(148, 187, 233, .3) !important; }
.vp-aurora .a3 { background: rgba(255, 170, 190, .22) !important; }
.vp-title { background: linear-gradient(90deg, #c9762b, #b3562f 55%, #7d6a3f) !important;
  -webkit-background-clip: text !important; background-clip: text !important; color: transparent !important; }
.vp-sub { color: #9c8f78 !important; -webkit-text-fill-color: #9c8f78 !important; }
.vp-note { color: #a99d87 !important; }
.vp-logo { filter: drop-shadow(0 2px 6px rgba(201, 118, 43, .35)) !important; }
.vp-tab { border-color: rgba(201, 118, 43, .3) !important; background: rgba(255, 255, 255, .75) !important; color: #8a6b45 !important; }
.vp-tab.on { background: linear-gradient(120deg, #e8a25c, #d9814f) !important; color: #fff !important; box-shadow: 0 6px 16px rgba(201, 118, 43, .3) !important; }
.vp-x, .vp-back { border-color: rgba(180, 160, 120, .35) !important; background: rgba(255, 255, 255, .8) !important; color: #8a7c62 !important; }
.vp-search { background: #fff !important; border-color: rgba(180, 160, 120, .35) !important; box-shadow: 0 2px 10px rgba(150, 130, 95, .1); }
.vp-search:focus-within { border-color: #e8a25c !important; box-shadow: 0 0 0 4px rgba(232, 162, 92, .18) !important; }
.vp-input { color: #4a4438 !important; }
.vp-input::placeholder { color: #b0a68f !important; }
.vp-go { color: #fff !important; background: linear-gradient(120deg, #e8a25c, #cf7a48) !important; box-shadow: 0 6px 16px rgba(201, 118, 43, .28) !important; }
.vp-sug { background: #fffdf8 !important; border-color: rgba(180, 160, 120, .3) !important; box-shadow: 0 18px 36px rgba(120, 100, 70, .18) !important; }
.vp-sug button { color: #5b5342 !important; }
.vp-sug button:hover { background: rgba(232, 162, 92, .12) !important; color: #8a5a22 !important; }
.vp-chip { border-color: rgba(180, 160, 120, .4) !important; background: rgba(255, 255, 255, .85) !important; color: #6f6552 !important; }
.vp-chip:hover { border-color: #e8a25c !important; color: #a35f1e !important; background: rgba(232, 162, 92, .12) !important; }
.vp-hot-c { border-color: rgba(180, 160, 120, .45) !important; color: #94886f !important; background: rgba(255, 255, 255, .6) !important; }
.vp-hot-c:hover { color: #a35f1e !important; border-color: #e8a25c !important; }
.vp-rowtitle { color: #4a4438 !important; }
.vp-more { color: #b0672a !important; }
.vp-card .vp-poster { border-color: rgba(180, 160, 120, .3) !important; box-shadow: 0 4px 14px rgba(150, 130, 95, .14); }
.vp-card:hover .vp-poster { border-color: #e8a25c !important; box-shadow: 0 12px 26px rgba(201, 118, 43, .3) !important; }
.vp-line { color: #5b5342 !important; }
.vp-rem { background: rgba(255, 251, 240, .92) !important; color: #8a6b45 !important; border: 1px solid rgba(180, 160, 120, .3); }
.vp-src { background: rgba(255, 251, 240, .92) !important; color: #8a6b45 !important; border-color: rgba(180, 160, 120, .4) !important; }
.vp-src.star { color: #b0672a !important; border-color: rgba(232, 162, 92, .6) !important; }
.vp-ltitle { color: #4a4438 !important; }
.vp-lcount, .vp-end { color: #a99d87 !important; }
.vp-empty p { color: #7d735f !important; }
.vp-empty small { color: #a99d87 !important; }
.vp-btn { border-color: rgba(180, 160, 120, .4) !important; background: rgba(255, 255, 255, .85) !important; color: #6f6552 !important; }
.vp-btn:hover { border-color: #e8a25c !important; color: #a35f1e !important; }
.vp-btn.primary { background: linear-gradient(120deg, #e8a25c, #cf7a48) !important; color: #fff !important; }
.vp-toast { color: #7a6a2b !important; background: linear-gradient(90deg, rgba(233, 205, 120, .35), rgba(214, 232, 160, .3)) !important; border-color: rgba(196, 170, 90, .5) !important; }
.vp-detail { background: linear-gradient(180deg, #fdfaf3, #f7f1e4) !important; }
.vp-hero-mask { backdrop-filter: blur(26px) brightness(1.06) !important;
  background: linear-gradient(90deg, rgba(253, 250, 243, .95), rgba(253, 250, 243, .6)) !important; }
.vp-hero-info h3 { color: #3f3a2e !important; }
.vp-meta span { color: #8a6b45 !important; background: rgba(255, 255, 255, .8) !important; border-color: rgba(180, 160, 120, .4) !important; }
.vp-meta span.src { color: #2f7d5c !important; background: rgba(214, 240, 226, .7) !important; border-color: rgba(120, 190, 155, .5) !important; }
.vp-meta span.res { color: #a35f1e !important; background: rgba(255, 236, 205, .85) !important; border-color: rgba(232, 162, 92, .55) !important; }
.vp-story { color: #7d735f !important; }
.vp-hero-poster { border-color: rgba(180, 160, 120, .4) !important; box-shadow: 0 12px 30px rgba(140, 120, 85, .28) !important; }
.vp-ctl, .vp-now { color: #7d6a3f !important; }
.vp-mini { border-color: rgba(180, 160, 120, .4) !important; background: rgba(255, 255, 255, .85) !important; color: #8a6b45 !important; }
.vp-auto { color: #94886f !important; }
.vp-qchip { border-color: rgba(180, 160, 120, .4) !important; background: rgba(255, 255, 255, .85) !important; color: #8a6b45 !important; }
.vp-qchip.on { background: linear-gradient(120deg, #e8a25c, #cf7a48) !important; color: #fff !important; border-color: transparent !important; }
.vp-ep { border-color: rgba(180, 160, 120, .35) !important; background: rgba(255, 255, 255, .85) !important; color: #6f6552 !important; }
.vp-ep:hover { border-color: #e8a25c !important; color: #a35f1e !important; }
.vp-ep.on { background: linear-gradient(120deg, #e8a25c, #cf7a48) !important; color: #fff !important; border-color: transparent !important; }
.vp-alts { background: rgba(255, 253, 248, .96) !important; border-color: rgba(180, 160, 120, .35) !important; }
.vp-alts-t { color: #8a6b45 !important; }
.vp-alt { background: #fff !important; border-color: rgba(180, 160, 120, .3) !important; color: #5b5342 !important; }
.vp-alt:hover { border-color: #e8a25c !important; background: rgba(232, 162, 92, .1) !important; }
.vp-alt-src { color: #b0672a !important; }
.vp-alt-meta { color: #94886f !important; }
.vp-alt-go { color: #2f7d5c !important; }
.vp-tip, .vp-lines .vp-line-chip, .vp-empty, .vp-empty-orb { color: #8a7c62 !important; }
.vp-tip { background: rgba(255, 250, 240, .85) !important; border-color: rgba(180, 160, 120, .4) !important; }
.vp-line-chip { border-color: rgba(180, 160, 120, .4) !important; background: rgba(255, 255, 255, .85) !important; color: #6f6552 !important; }
.vp-line-chip:hover { color: #a35f1e !important; border-color: #e8a25c !important; }
.vp-line-chip.on { background: linear-gradient(120deg, #e8a25c, #cf7a48) !important; color: #fff !important; }
.vp-empty-orb { background: radial-gradient(circle at 32% 28%, rgba(232, 162, 92, .3), rgba(255, 226, 190, .2)) !important; border-color: rgba(232, 162, 92, .35) !important; color: #c9762b !important; }
.vp-empty-orb.soft { background: radial-gradient(circle at 32% 28%, rgba(255, 205, 130, .35), rgba(255, 236, 210, .25)) !important; border-color: rgba(232, 180, 110, .4) !important; color: #d99433 !important; }
.vp-rowtitle.sk-anim, .vp-line.bar, .vp-mini.sk-anim { background: #efe7d6 !important; }
.vp-player-wrap { border-color: rgba(180, 160, 120, .4) !important; box-shadow: 0 16px 40px rgba(140, 120, 85, .3) !important; }

/* ============ 播放器悬浮控制条 + 选集抽屉 ============ */
.vp-pctl { position: absolute; left: 10px; right: 10px; bottom: 62px; z-index: 5; display: flex; align-items: center; gap: 6px;
  pointer-events: none; }
.vp-pctl .vp-pbtn { pointer-events: auto; }
.vp-pbtn { display: inline-flex; align-items: center; justify-content: center; gap: 4px; height: 34px; min-width: 34px; padding: 0 10px;
  border-radius: 10px; border: 1px solid rgba(255, 255, 255, .28); background: rgba(20, 20, 24, .55); color: #fff;
  cursor: pointer; backdrop-filter: blur(6px); transition: all .16s; font-size: 12px; }
.vp-pbtn:hover { background: rgba(232, 162, 92, .85); border-color: transparent; }
.vp-pbtn:disabled { opacity: .4; cursor: not-allowed; }
.vp-pbtn.wide { margin-left: auto; font-weight: 700; }
.vp-drawer { position: absolute; right: 10px; bottom: 104px; z-index: 6; width: min(340px, 76%); max-height: 60%;
  background: rgba(255, 253, 248, .98); border: 1px solid rgba(180, 160, 120, .35); border-radius: 14px;
  box-shadow: 0 18px 40px rgba(90, 74, 44, .3); overflow: hidden; display: flex; flex-direction: column; }
.vp-drawer-t { display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; font-size: 12.5px;
  font-weight: 800; color: #8a6b45; border-bottom: 1px solid rgba(180, 160, 120, .22); }
.vp-drawer-x { border: none; background: transparent; color: #a99d87; cursor: pointer; display: flex; }
.vp-drawer-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(64px, 1fr)); gap: 6px; padding: 10px; overflow-y: auto; }
.vp-drawer-ep { border: 1px solid rgba(180, 160, 120, .35); background: #fff; color: #6f6552; font-size: 11.5px; padding: 6px 4px;
  border-radius: 8px; cursor: pointer; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.vp-drawer-ep:hover { border-color: #e8a25c; color: #a35f1e; }
.vp-drawer-ep.on { background: linear-gradient(120deg, #e8a25c, #cf7a48); color: #fff; border-color: transparent; }
</style>
