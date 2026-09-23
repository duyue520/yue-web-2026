<template>
    <v-container fluid class="pa-0 tab2">
      <v-tabs
          v-model="tab"
          :items="tabs"
          align-tabs="center"
          height="25"
          slider-color=var(--leleo-vcard-color)
        >
          <template v-slot:tab="{ item }">
            <v-tab
              :prepend-icon="item.icon"
              :text="item.text"
              :value="item.value"
              class="text-none"
            ></v-tab>
          </template>
          
          <template v-slot:item="{ item }">
            <v-tabs-window-item :value="item.value" class="pa-4">
                <div v-if="item.value === 'tab-1'">
                    <v-radio-group v-model="radios" inline>
                        <template v-slot:label>
                            <div class="mb-2 d-flex justify-space-between" style="width: 100%;align-items: center;">
                                <div class="itemText"><strong :style="smAndDown?{'font-size':'13px'}:{}">{{ radios.title }}</strong></div>
                                <v-menu location="bottom" :offset="[0, 15]">
                                    <template v-slot:activator="{ props }">
                                        <v-btn variant="tonal"
                                        v-bind="props" :density="smAndDown?'compact':'default'"
                                        >
                                        <v-icon>mdi-arrow-down</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-card class="d-flex flex-column">
                                        <v-btn variant="tonal"
                                            v-for="(item, index) in staticType"
                                            :key="index"
                                            @click="switchType(item.type,'static')"
                                        >
                                            {{ item.name }}
                                        </v-btn>
                                    </v-card>
                                </v-menu>
                            </div>
                            
                        </template>
                        <v-row class="scroll-container">
                            <v-col :cols="type == 'mobile' ? 6:12" :sm="type == 'mobile' ? 4:6" :md="type == 'mobile' ? 3:4" v-for="item in paginatedPICItems" :key="item.preview" class="d-flex justify-center">
                                <v-img rounded="lg" @click="radios = item" style="cursor: pointer"
                                :class="{'selected-item':radios === item }"
                                :max-width="smAndDown ? (type == 'mobile' ? 100 : 200) : (type == 'mobile' ? 160 : 250)"
                                :max-height="smAndDown ? (type == 'mobile' ? 170 : 120) : (type == 'mobile' ? 272 : 150)"
                                cover
                                :src=item.preview
                                >
                                <template v-slot:placeholder>
                                    <v-row
                                        align="center"
                                        class="fill-height ma-0"
                                        justify="center"
                                    >
                                        <v-progress-circular
                                        color="grey-lighten-5"
                                        indeterminate
                                        ></v-progress-circular>
                                    </v-row>
                                </template>
                                </v-img>
                            </v-col>
                        </v-row>
                    </v-radio-group>
                    <v-pagination
                    v-model="currentPICPage"
                    :length="totalPICPages"
                    @input="updatePICPage"
                    :density="smAndDown? 'compact':'default'"
                    ></v-pagination>
                </div>
                <div v-if="item.value === 'tab-2'">
                    <v-radio-group v-model="radios" inline>
                        <template v-slot:label>
                            <div class="mb-2 d-flex justify-space-between" style="width: 100%;align-items: center;">
                                <div class="itemText"><strong :style="smAndDown?{'font-size':'13px'}:{}">{{ radios.title }}</strong></div>
                                <v-menu location="bottom" :offset="[0, 15]">
                                    <template v-slot:activator="{ props }">
                                        <v-btn variant="tonal" :density="smAndDown?'compact':'default'"
                                        v-bind="props"
                                        >
                                        <v-icon>mdi-arrow-down</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-card class="d-flex flex-column">
                                        <v-btn variant="tonal"
                                            v-for="(item, index) in staticType"
                                            :key="index"
                                            @click="switchType(item.type,'dynamic')"
                                        >
                                            {{ item.name }}
                                        </v-btn>
                                    </v-card>
                                </v-menu>
                            </div>
                        </template>
                        <v-row class="scroll-container">
                            <v-col :cols="type == 'mobile' ? 6:12" :sm="type == 'mobile' ? 4:6" :md="type == 'mobile' ? 3:4" v-for="item in paginatedVDItems" :key="item.preview" class="d-flex justify-center">
                                <div class="video-container" @click="radios = item" style="cursor: pointer">
                                    <!-- 加载提示 -->
                                    <div v-if="!item.loaded" class="loading-spinner">
                                        <v-progress-circular indeterminate></v-progress-circular>
                                    </div>
                                    <video autoplay loop muted 
                                        @click="item=radios"
                                        :class="{'selected-item':radios === item }"
                                        :style="type == 'mobile'?(smAndDown ?{width: '100px',height:'170px'}:{width: '160px',height:'272px'}):(smAndDown ?{width: '200px'}:{width: '250px'})"
                                        style="object-fit: cover;"
                                        rounded="lg" @loadeddata="item.loaded = true"
                                    >
                                        <source :src=item.preview type="video/mp4">
                                    </video>
                                </div>
                            </v-col>
                        </v-row>
                    </v-radio-group>

                    <v-pagination
                    v-model="currentVDPage"
                    :length="totalVDPages"
                    @input="updateVDPage"
                    :density="smAndDown? 'compact':'default'"
                    ></v-pagination>
                </div>
            </v-tabs-window-item>
          </template>
        </v-tabs>
         <div style="text-align: center;font-size: 12px;"><span>不同壁纸在相应设备下响应</span></div>
    </v-container>
    <div class="d-flex justify-center mt-3">
        <v-btn :loading="loading1" variant="tonal" class="ma-2" @click="redefault()">恢复</v-btn>
        <v-btn :loading="loading3" variant="tonal" class="ma-2" @click="cancel()">取消</v-btn>
        <v-btn :loading="loading2" variant="tonal" class="ma-2" @click="submitdata()">确认</v-btn>
    </div>

    <v-snackbar
      :timeout="2000"
      color="info"
      rounded="pill"
      location="top"
      v-model="snackbar"
    >
    请选择壁纸
    </v-snackbar>
  </template>

<script>
import { useDisplay } from 'vuetify';
import { setCookie, getCookie, eraseCookie } from '../../utils/cookieUtils.js';
import config from '../../config.js';
export default {
    emits: ['cancel'],
    setup() {
        const { smAndDown } = useDisplay();
        return { smAndDown };
    },
    data () {
        return {
            loading1: false,
            loading2: false,
            loading3: false,
            snackbar:false,
            configdata:config,
            background: {'pc':{},'mobile':{}},
            wallpaperPIC: null,
            wallpaperVD: null,
            radios: {},
            currentVDPage: 1,
            currentPICPage: 1,
            itemsPerPage: 6, // 每页显示的item数量
            tab: null,
            tabs: [
                {
                    icon: 'mdi-panorama-variant-outline',
                    text: '图片壁纸',
                    value: 'tab-1',
                },
                {
                    icon: 'mdi-video-input-svideo',
                    text: '动态壁纸',
                    value: 'tab-2',
                },
            ],
            staticType: [
                { type: 'pc',name: '电脑壁纸' },
                { type: 'mobile',name: '手机壁纸' },
            ],
            type:'pc'
        }
    },
    mounted() {
        if(import.meta.env.VITE_CONFIG){
            this.configdata = JSON.parse(import.meta.env.VITE_CONFIG);
        }
        this.wallpaperPIC = this.configdata.wallpaper.pic;
        this.wallpaperVD = this.configdata.wallpaper.video;
        this.radios.title = "请选择壁纸";
    },
    watch: {
        tab(val) {
            this.type = 'pc';
            this.itemsPerPage = 6;
            if(val == 'tab-1'){
                this.wallpaperPIC = this.configdata.wallpaper.pic;
            }else{
                this.wallpaperVD = this.configdata.wallpaper.video;
            }
        }
    },
    computed: {
        // 计算总页数
        totalVDPages() {
            return Math.ceil(this.wallpaperVD.length / this.itemsPerPage);
        },
        totalPICPages() {
            return Math.ceil(this.wallpaperPIC.length / this.itemsPerPage);
        },
        // 计算当前页显示的item
        paginatedPICItems(){
            const start = (this.currentPICPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.wallpaperPIC.slice(start, end);
        },
        paginatedVDItems() {
            const start = (this.currentVDPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.wallpaperVD.slice(start, end);
        },
    },
    methods: {
        setCookie,
        getCookie,
        eraseCookie,
        submitdata() {
            if(!this.radios.url){
                this.snackbar = true;
                return;
            }
            let leleodatabackground = this.getCookie("leleodatabackground");
            delete this.radios.loaded;
            if(this.type == 'mobile'){
                this.background.mobile.type= this.tab === 'tab-1'? 'pic' : 'video';
                this.background.mobile.datainfo = this.radios;
                if(leleodatabackground){
                    this.background.pc = leleodatabackground.pc;
                }else{
                    this.background.pc = this.configdata.background.pc;
                }
            }else{
                this.background.pc.type= this.tab === 'tab-1'? 'pic' : 'video';
                this.background.pc.datainfo = this.radios;
                if(leleodatabackground){
                    this.background.mobile = leleodatabackground.mobile;
                }else{
                    this.background.mobile = this.configdata.background.mobile;
                }
            }

            this.loading2 = true
            setTimeout(() => {
                this.loading2 = false;
                this.setCookie('leleodatabackground', this.background,0.005);
                location.reload();
            }, 800)   
        },
        redefault(){              
            this.loading1 = true
            setTimeout(() => {
                this.loading2 = false;
                this.eraseCookie('leleodatabackground');
                location.reload();
            }, 800) 
        },
        cancel() {
            this.$emit('cancel');
        },
        // 更新当前页
        updateVDPage(page) {
            this.currentVDPage = page;
        },
        updatePICPage(page) {
            this.currentPICPage = page;
        },
        switchType(type,tabtype){
            if(tabtype == 'static'){
                if(type == 'mobile'){
                    this.type='mobile';
                    this.itemsPerPage = 8;
                    this.wallpaperPIC = this.configdata.wallpaper.picMobile;
                }else if(type == 'pc'){
                    this.type='pc';
                    this.itemsPerPage = 6;
                    this.wallpaperPIC = this.configdata.wallpaper.pic;
                }
                this.currentPICPage = 1;;
            }else{
                if(type == 'mobile'){
                    this.type='mobile';
                    this.itemsPerPage = 8;
                    this.wallpaperVD = this.configdata.wallpaper.videoMobile;
                }else if(type == 'pc'){
                    this.type='pc';
                    this.itemsPerPage = 6;
                    this.wallpaperVD = this.configdata.wallpaper.video;
                }
                this.currentVDPage = 1;
            }
        },
    },

}
</script>
<style scoped>
@import url(/css/mobile.less);
</style>
<style scoped>
video{
    pointer-events: none;
    border-radius: 0.5rem;
}
.itemText{
    width: 50%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.loading-spinner {
    position: absolute;
     top: 50%;
    left: 50%;
     transform: translate(-50%, -50%); 
    z-index: 1; 
}
.video-container {
    position: relative;
    display: flex;
}

.scroll-container {
    max-height: 300px;
    overflow-y: auto;
}

/* 覆盖全局的滚动条样式 */
.scroll-container::-webkit-scrollbar {
  width: 5px; /* 设置滚动条宽度 */
}

.scroll-container::-webkit-scrollbar-thumb {
  background-color: #888; /* 设置滚动条颜色 */
  border-radius: 4px; /* 设置滚动条圆角 */
}
.selectedStyle{
    border: 2px solid var(--leleo-vcard-color);
    
    box-shadow: 0 0 10px rgba(25, 118, 210, 0.5),;
}

.selected-item {
  border-color: var(--leleo-vcard-color); /* 选中时的边框颜色 */
  box-shadow: 0 0 10px var(--leleo-vcard-color); /* 选中时的阴影 */
}
</style>