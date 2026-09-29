import homeright from '../src/components/hoemright.vue';
import tab1 from './components/tabs/tab1.vue';
import tab2 from './components/tabs/tab2.vue';
import loader from './components/loader.vue';

import LoginGate from './components/disease/LoginGate.vue';
import MusicDialog from './components/MusicDialog.vue';
import ParticleLayer from './components/ParticleLayer.vue';
import { defineAsyncComponent } from 'vue';
// ★ 首屏不必需的重型组件改为异步按需加载（减小首屏 JS、加快可交互时间）
const DiseaseMain = defineAsyncComponent(() => import('./components/disease/DiseaseMain.vue'));
const ProfileDialog = defineAsyncComponent(() => import('./components/ProfileDialog.vue'));
const Guestbook = defineAsyncComponent(() => import('./components/Guestbook.vue'));
const BlogPage = defineAsyncComponent(() => import('./components/BlogPage.vue'));
const polarchart = defineAsyncComponent(() => import('./components/polarchart.vue'));
const ApproveDialog = defineAsyncComponent(() => import('./components/ApproveDialog.vue'));
const AiChat = defineAsyncComponent(() => import('./components/AiChat.vue'));
const AiGateway = defineAsyncComponent(() => import('./components/AiGateway.vue'));
const VideoPage = defineAsyncComponent(() => import('./components/VideoPage.vue'));
import config from './config.js';
import { getCookie } from './utils/cookieUtils.js';
import { setMeta,getFormattedTime,getFormattedDate,dataConsole } from './utils/common.js';
import { useDisplay } from 'vuetify'
import api from './services/api.js'

export default {
  components: {
    AiChat,AiGateway,VideoPage,
    tab1,tab2,loader,homeright,polarchart,DiseaseMain,LoginGate,ProfileDialog,Guestbook,MusicDialog,BlogPage,ParticleLayer,ApproveDialog,ApproveDialog
  },
  setup() {
    const { xs,sm,md } = useDisplay();
    return { xs,sm,md };
  },
  data() {
    return {
      isloading:false,
      isClearScreen: false,
      formattedTime:"",
      formattedDate:"",
      configdata: config,
      dialog1: false,
      dialog2: false,
      personalizedtags: null,
      videosrc: '',
      chartReady: false,
      ismusicplayer: false,
      isPlaying:false,
      playlistIndex: 0,
      playMode: 'order',
      playMode: 'order',
      audioLoading: false,
      musicinfo: null,
      musicinfoLoading:false,
      lyrics:[],
      audioCurrentTime: 0,
      audioDuration: 0,
      socialPlatformIcons: null,
      isExpanded: false,
      stackicons:[
        {icon:"mdi-vuejs",color:"green", model: false,tip: 'vue'},
        {icon:"mdi-language-javascript",color:"#CAD300", model: false,tip: 'javascript'},
        {icon:"mdi-language-css3",color:"blue", model: false,tip: 'css'},
        {icon:"mdi-language-html5",color:"red", model: false,tip: 'html'},
        {icon:"$vuetify",color:"#1697F6", model: false,tip: 'vuetify'},
      ],
      projectcards:null,
      diseaseDialog: false,
      showLoginGate: true,
      isUserLoggedIn: false,
      tab: null,
      tabs: [
        {
          icon: 'mdi-pencil-plus',
          text: '样式预览',
          value: 'tab-1',
          component: "tab1",
        },
        {
          icon: 'mdi-wallpaper',
          text: '背景预览',
          value: 'tab-2',
          component: "tab2",
        },
      ],

    };
  },
  async mounted() {
    if(import.meta.env.VITE_CONFIG){
      this.configdata = JSON.parse(import.meta.env.VITE_CONFIG);
    }
    this.projectcards = this.configdata.projectcards;this.socialPlatformIcons = this.configdata.socialPlatformIcons;
    this.personalizedtags = this.configdata.tags;
    this.isloading = true;
    let imageurl = "";
    this.dataConsole();
    this.setMeta(this.configdata.metaData.title,this.configdata.metaData.description,this.configdata.metaData.keywords,this.configdata.metaData.icon);
    
    imageurl = this.setMainProperty(imageurl);

    //异步等待背景壁纸包括视频壁纸加载完成后再显示页面
    const loadImage = () => {
        const imageUrls = [
          config.avatar,
          ...config.projectcards.map(item => item.img)
        ];
        // 注意：这里必须"永不 reject"——任何一张图 404 都不能拦住首屏，
        // 否则 isloading 永远为 true，页面会一直卡在加载遮罩上。
        return new Promise((resolve) => {
          let settled = false;
          const done = () => { if (!settled) { settled = true; resolve(); } };
          const imagePromises = imageUrls.map((url) => {
            return new Promise((res) => {
                const imgs = new Image();
                imgs.onload = () => res();
                imgs.onerror = () => res();      // 失败也放行，不阻塞首屏
                imgs.src = url;
            });
          })

          // 设置超时机制：1.5秒（超过就不等图片了）
          const timeoutPromise = new Promise((res) => {
            setTimeout(res, 800);
          });
          
          // 等待所有图片加载完成或超时
          Promise.race([Promise.all(imagePromises), timeoutPromise]).then(()=>{
            if(imageurl){
              const img = new Image();
              img.onload = done;
              img.onerror = done;                // 背景图失败也要放行
              setTimeout(done, 1200);           // 背景图硬超时兜底
              img.src = imageurl;
            }else{
              // 视频壁纸已改为首屏后延迟加载，这里直接放行，不再等它
              done();
            }
          }).catch(() => done());
        });
     };

    // 检测 URL hash 自动打开诊断
    this.checkHashRoute();
    window.addEventListener('hashchange', () => this.checkHashRoute());

    loadImage().then(async () => {
        this.formattedTime =  this.getFormattedTime(new Date());
        this.formattedDate =  this.getFormattedDate(new Date());
        // 检查是否已登录（7天内免登录）
        if (api.isLoggedIn()) {
          try {
            const user = await api.fetchUserInfo();
            if (user) {
              this.showLoginGate = false;
              this.isUserLoggedIn = true;
            }
          } catch(e) {
            // token过期，清除并显示登录门禁
            api.logout();
          }
        }
        // 视频壁纸立即挂载：浏览器先渲染 poster（约 100KB 静态图，秒出画面），视频并行下载
        if (this._pendingVideo && !this.videosrc) this.videosrc = this._pendingVideo;
        setTimeout(() => {
          this.isloading = false;
          // 首屏稳定后再渲染重组件（雷达图 + 粒子层，合计约 250KB JS）
          setTimeout(() => { this.chartReady = true; }, 900);
        }, "180");
      }).catch((err) => {
        console.error('加载失败:', err);
        this.isloading = false;
      });
 
      setInterval(() => {
        this.formattedTime =  this.getFormattedTime(new Date()) ;
      }, 1000);

      await this.getMusicInfo();  //获取音乐数据
      this.setupAudioListener();  //设置 ended 事件监听器，当歌曲播放结束时自动调用 nextTrack 方法。
  },

  beforeDestroy() {     //在组件销毁前移除事件监听器，防止内存泄漏。
    this.$refs.audioPlayer.removeEventListener('ended',  this.nextTrack);
  },

  watch:{
    isClearScreen(val){
      if(!this.videosrc){
        return
      }
      if(val){
        this.$refs.VdPlayer.style.zIndex = 0; 
        this.$refs.VdPlayer.controls = true;
      }else{
        this.$refs.VdPlayer.style.zIndex = -100; 
        this.$refs.VdPlayer.controls = false;
      }
    },
    audioLoading(val){
      this.isPlaying = !val;
    },
    videosrc(v){
      // 动态换视频壁纸源后，主动触发加载与播放（默认延迟加载时用）
      if(!v) return;
      this.$nextTick(() => {
        const el = this.$refs.VdPlayer;
        if(el){
          try{ el.load(); const p = el.play(); if(p && p.catch) p.catch(()=>{}); }catch(e){}
        }
      });
    }

  //若弹出框使得页面播放卡顿，可以先停止背景播放
  //   dialog1(val){
  //     if(val){
  //       this.$refs.VdPlayer.pause();
  //     }else{
  //       this.$refs.VdPlayer.play();
  //     }
  //  }
  },

  computed: {
    currentSong() {
      return this.musicinfo?.[this.playlistIndex];
    },
    currentMusicSong() { return this.musicinfo?.[this.playlistIndex]; },
    musicIsPlaying() { return this.isPlaying; },
    musicProgress() { if (!this.audioDuration) return 0; return (this.audioCurrentTime / this.audioDuration) * 100; },
    musicCurrentTime() { return this.audioCurrentTime || 0; },
    musicDuration() { return this.audioDuration || 0; },
    musicLyric1() {
      const t = this.audioCurrentTime || 0;
      let cur = '';
      const lrc = this.lyrics?.[this.playlistIndex] || [];
      for (let i = lrc.length-1; i>=0; i--) {
        if (t >= lrc[i]?.time) { cur = lrc[i]?.text||''; break; }
      }
      return cur;
    },
    audioPlayer() {
      return this.$refs.audioPlayer;
    }
  },
  
  methods: {
    // 诊断页追问：带着病害上下文打开越的分身
    onAskAi(payload) {
      const ai = this.$refs.aiChat;
      if (ai) ai.openWith({ context: payload?.context || '', preset: payload?.preset || '' });
    },
    getCookie,setMeta,getFormattedTime,getFormattedDate,dataConsole,

    setMainProperty(imageurl){
      const root = document.documentElement;
      let leleodata = this.getCookie("leleodata");
      if(leleodata){
        root.style.setProperty('--leleo-welcomtitle-color', `${leleodata.color.welcometitlecolor}`);
        root.style.setProperty('--leleo-vcard-color', `${leleodata.color.themecolor}`);
        root.style.setProperty('--leleo-brightness', `${leleodata.brightness}%`);
        root.style.setProperty('--leleo-blur', `${leleodata.blur}px`); 
      }else{
        root.style.setProperty('--leleo-welcomtitle-color', `${this.configdata.color.welcometitlecolor}`);
        root.style.setProperty('--leleo-vcard-color', `${this.configdata.color.themecolor}`);  
        root.style.setProperty('--leleo-brightness', `${this.configdata.brightness}%`);  
        root.style.setProperty('--leleo-blur', `${this.configdata.blur}px`);
      }
  
      let leleodatabackground = this.getCookie("leleodatabackground");
      const { xs } = useDisplay();
      if(leleodatabackground){
        if(xs.value){
          if(leleodatabackground.mobile.type == "pic"){
            root.style.setProperty('--leleo-background-image-url', `url('${leleodatabackground.mobile.datainfo.url}')`);
            imageurl = leleodatabackground.mobile.datainfo.url;
            return imageurl;
          }else{
            this._pendingVideo = leleodatabackground.mobile.datainfo.url;
          }
        }else{
          if(leleodatabackground.pc.type == "pic"){
            root.style.setProperty('--leleo-background-image-url', `url('${leleodatabackground.pc.datainfo.url}')`);
            imageurl = leleodatabackground.pc.datainfo.url;
            return imageurl;
          }else{
            this._pendingVideo = leleodatabackground.pc.datainfo.url;
          }
        }
          
      }else{
        if(xs.value){
          if(this.configdata.background.mobile.type == "pic"){
            root.style.setProperty('--leleo-background-image-url', `url('${this.configdata.background.mobile.datainfo.url}')`);
            imageurl = this.configdata.background.mobile.datainfo.url;
            return imageurl;
          }else{
            this._pendingVideo = this.configdata.background.mobile.datainfo.url;
          }
        }else{
          if(this.configdata.background.pc.type == "pic"){
            root.style.setProperty('--leleo-background-image-url', `url('${this.configdata.background.pc.datainfo.url}')`);
            imageurl = this.configdata.background.pc.datainfo.url;
            return imageurl;
          }else{
            this._pendingVideo = this.configdata.background.pc.datainfo.url;
          }
          
        }
      }
    },

    projectcardsShow(key){
      this.projectcards.forEach((item,index)=>{
        if(index!= key){
          item.show = false;
        }
      })
    },
    checkHashRoute() {
      if (window.location.hash === '#disease') {
        if (api.isLoggedIn()) {
          this.openDiseaseDialog();
        } else {
          this._pendingDisease = true;
        }
      } else if (window.location.hash === '#blog') {
        if (api.isLoggedIn()) {
          this.openBlogPage();
        } else {
          this._pendingBlog = true;
        }
      } else if (window.location.hash === '#aigw') {
        this.openAiGateway();
      } else if (window.location.hash === '#video') {
        this.openVideoPage();
      }
    },
    onGateDone(result) {
      this.isUserLoggedIn = result.loggedIn;
      if (this._pendingDisease) { this._pendingDisease = false; this.openDiseaseDialog(); }
      if (this._pendingBlog) { this._pendingBlog = false; this.openBlogPage(); }
      if (window.location.hash === '#aigw') { this.openAiGateway(); }
    },
    onProfileUpdated(data) {
      if (data.username) {
        const oldUser = JSON.parse(localStorage.getItem('disease_user')||'{}'); localStorage.setItem('disease_user', JSON.stringify({ id: data.id||oldUser.id, username: data.username }));
      }
    },
    openMusicPlayer() { this.$refs.musicDialog.open(); },
    musicSeek(pct){const a=this.$refs.audioPlayer;if(a&&a.duration)a.currentTime=a.duration*(pct/100);},
    onUserLogout() {
      this.isUserLoggedIn = false;
      this.showLoginGate = true;
      const ai = this.$refs.aiChat;
      if (ai && ai.onLogout) ai.onLogout();
    },
    // 等异步(懒加载)组件挂载出 ref 后再调用，避免首次点击无反应
    async waitRef(name, timeout = 5000) {
      const t0 = Date.now();
      while (!this.$refs[name] && Date.now() - t0 < timeout) {
        await new Promise((r) => setTimeout(r, 50));
      }
      return this.$refs[name];
    },
    async openBlogPage() {
      const c = await this.waitRef('blogPage');
      if (c) c.visible = true;
    },
    async openDiseaseDialog() {
      this.diseaseDialog = true;
      const c = await this.waitRef('diseaseMain');
      if (c && c.open) c.open();
    },
    handleCardAction(action) {
      if (action === 'disease') {
        window.location.hash = '#disease';
        this.openDiseaseDialog();
      } else if (action === 'blog') {
        window.location.hash = '#blog';
        this.openBlogPage();
      } else if (action === 'aigw') {
        window.location.hash = '#aigw';
        this.openAiGateway();
      } else if (action === 'video') {
        window.location.hash = '#video';
        this.openVideoPage();
      }
    },
    async openAiGateway() {
      const c = await this.waitRef('aiGateway');
      if (c && c.open) c.open();
    },
    async openVideoPage() {
      const c = await this.waitRef('videoPage');
      if (c && c.open) c.open();
    },
    handleCancel(){
      this.dialog1 = false;
    },
    
    async getMusicInfo(){
      this.musicinfoLoading = true;
      this.musicinfo = [];
      const mid = this.configdata.musicPlayer.id;
      if (mid && mid !== '0') {
      try {
        const response = await fetch(`https://api.i-meto.com/meting/api?server=${this.configdata.musicPlayer.server}&type=${this.configdata.musicPlayer.type}&id=${mid}`
        );
        if (!response.ok) {
          throw new Error('网络请求失败');
        }
        this.musicinfo = await response.json();
      } catch (error) {
        console.error('请求失败:', error);
      }
      }
      // 合并本地歌曲（无论API是否成功）
      const localSongs = this.configdata.localMusic || [];
      localSongs.forEach(s => {
        this.musicinfo.push({title:s.title,author:s.author,pic:s.pic,url:s.url,lrc:s.lrc});
      });
      this.musicinfoLoading = false;
    },
    musicplayershow(val) {
        this.ismusicplayer = val;
    },

    setupAudioListener() {
      const audio = this.$refs.audioPlayer;
      audio.volume = 1.0;
      audio.addEventListener('ended', this.nextTrack);
      audio.addEventListener('error', () => {
        this.audioLoading = false;
        this.isPlaying = false;
      });
      audio.addEventListener('timeupdate', () => {
        this.audioCurrentTime = audio.currentTime;
        this.audioDuration = audio.duration;
      });
    },

    togglePlay() {
      if (!this.isPlaying) {
        this.audioPlayer.play();
        
      } else {
        this.audioPlayer.pause();
        
      }
      this.isPlaying = !this.musicinfoLoading && !this.isPlaying;
    },
    previousTrack() {
      this.playlistIndex = this.playlistIndex > 0 ? this.playlistIndex - 1 : this.musicinfo.length - 1;
      this.updateAudio();
    },
    nextTrack() {
      const n = this.musicinfo?.length || 0;
      if (!n) return;
      if (this.playMode === 'single') {
        // 单曲循环：从头重播当前曲
        const a = this.$refs.audioPlayer;
        if (a) { a.currentTime = 0; a.play(); this.isPlaying = true; }
        return;
      }
      if (this.playMode === 'random' && n > 1) {
        let i = this.playlistIndex;
        while (i === this.playlistIndex) i = Math.floor(Math.random() * n);
        this.playlistIndex = i;
      } else {
        this.playlistIndex = this.playlistIndex < n - 1 ? this.playlistIndex + 1 : 0;
      }
      this.updateAudio();
    },
    onPlayMode(m) { this.playMode = m || 'order'; },
    updateAudio() {
      this.audioPlayer.src = this.currentSong.url;
      this.$refs.audiotitle.innerText = this.currentSong.title;
      this.$refs.audioauthor.innerText = this.currentSong.author;
      this.isPlaying = true;
      this.audioPlayer.play();
      this.loadLyricsForSong(this.playlistIndex);
    },
    async loadLyricsForSong(idx) {
      const song = this.musicinfo?.[idx];
      if (!song) return;
      let text = '';
      try {
        if (song.onlineId) {
          // 在线歌曲：从后端代理拉 LRC
          const data = await api.musicLyric(song.onlineId);
          text = data?.lrc || '';
        } else if (song.lrc) {
          const encoded = song.lrc.split('/').map(p=>encodeURIComponent(p)).join('/');
          const cacheBuster = '?t=' + Date.now();
          const res = await fetch(encoded + cacheBuster);
          if (!res.ok) throw new Error('HTTP ' + res.status);
          text = await res.text();
        }
        if (!text || text.includes('暂无歌词')) { console.warn('LRC empty for:', song.title); return; }
        const lines = text.split('\n').map(line => {
          const m = line.match(/^\[(\d+):(\d+)\.(\d+)\](.*)/);
          if (m) return { time: parseFloat(m[1])*60+parseFloat(m[2])+parseFloat(m[3])/1000, text: m[4].trim() };
          return null;
        }).filter(l => l);
        if (!this.lyrics) this.lyrics = [];
        this.lyrics[idx] = lines;
      } catch(e) { console.error('Load lyrics failed:', song?.title, e); }
    },
    // 在线搜歌：MusicDialog 已通过 API 拿到播放信息，这里只负责入队 + 播放
    playOnlineSong(info) {
      if (!info?.playUrl) return;
      this.musicinfo.push({
        title: info.name || '未知歌曲',
        author: info.artist || '未知歌手',
        pic: info.pic || '/img/avatar.webp',
        url: info.playUrl,
        lrc: null,
        onlineId: info.id,
      });
      this.playlistIndex = this.musicinfo.length - 1;
      this.updateAudio();
    },
    updateCurrentIndex(index) {
      this.playlistIndex = index;
      this.updateAudio();
    },
    updateIsPlaying(isPlaying) {
      this.isPlaying = isPlaying;
    },
    updateLyrics(data){
      if (!this.lyrics) this.lyrics = [];
      this.lyrics[data.index] = data.lyrics;
    },
    // 监听等待事件（缓冲不足）
    onWaiting() {
      this.audioLoading = true;
    },
    // 监听可以播放事件（缓冲足够）
    onCanPlay() {
      this.audioLoading = false;
    },
    expandSwitch() {
      this.isExpanded = true;
    },
    collapseSwitch() {
      this.isExpanded = false;
    },
  }
};