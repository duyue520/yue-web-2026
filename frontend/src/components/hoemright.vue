<template>
      <div>
        <div>
          <div :style="xs||sm?{'display':'none'}:{'font-size':'4rem'}" class="leleo-left-welcome">{{ configdata.welcometitle }}</div>
        </div>
        <div>
          <v-row align="center">
            <v-col cols="12" md="8">
              <!-- 音乐迷你条 -->
              <v-card v-if="currentSong && currentSong.title" class="music-mini mb-2" variant="tonal" :style="xs||sm?{'display':'none'}:{}">
                <div class="d-flex align-center pa-2">
                  <v-avatar size="36" rounded="lg" class="mr-2"><v-img :src="currentSong.pic" cover /></v-avatar>
                  <div class="flex-grow-1" style="min-width:0">
                    <div class="text-body-2 text-truncate font-weight-bold">{{ currentSong.title }}</div>
                    <div class="text-caption text-grey text-truncate">{{ currentSong.author }}</div>
                  </div>
                  <v-btn icon size="36" variant="text" @click="$emit('musicPrev')"><v-icon size="24">mdi-skip-previous</v-icon></v-btn>
                  <v-btn icon size="48" variant="text" color="green-darken-2" @click="$emit('musicToggle')">
                    <v-icon size="36">{{ musicPlaying ? 'mdi-pause-circle' : 'mdi-play-circle' }}</v-icon>
                  </v-btn>
                  <v-btn icon size="36" variant="text" @click="$emit('musicNext')"><v-icon size="24">mdi-skip-next</v-icon></v-btn>
                  <v-btn icon size="32" variant="text" class="ml-1" @click="$emit('openPlayer')"><v-icon size="20">mdi-playlist-music</v-icon></v-btn>
                </div>
              </v-card>
              <typewriter class="ma-3 d-flex align-center justify-center" style="min-height: 200px;"></typewriter>
            </v-col>
            <v-col cols="12" md="4" align="center">
              <v-card class="ma-3" hover
                >
                  <template v-slot:title >
                    <span class="leleo-card-title clock-font">{{formattedTime}}</span>
                  </template>
                  <template v-slot:subtitle>
                    <span style="font-weight: bold;">{{formattedDate}}</span>
                  </template>
                  <turntable :color1="configdata.color.turntablecolor1" :color2="configdata.color.turntablecolor2" />
              </v-card>
            </v-col>
          </v-row>
          
          <v-chip class="mt-3 ml-3" prepend-icon="mdi-webhook"  size="large" style="color: var(--leleo-vcard-color);">
            部署项目
          </v-chip>
          <v-container>
            <v-row>
              <v-col
                v-for="(item,key) in projectcards"
                cols="6"
                md="4"
                lg="3"
                :style="xs?{'padding': '6px'}:{}"
              >
                <v-card class="">
                  <v-img
                    aspect-ratio="1.7778"
                    :src= item.img
                    cover
                    :style="{ opacity: 0.8 }"
                  ></v-img>
                  <v-card-title :style="xs?{'font-size': '0.9rem','padding': '0.15rem 0.5rem'}:{'font-size': '1.1rem','padding':'0.2rem 0.8rem'}">
                    {{item.title}}
                  </v-card-title>
                  <v-card-subtitle :style="xs?{'font-size': '0.6rem','padding': '0.1rem 0.5rem'}:{'font-size': '0.8rem','padding':'0.15rem 0.6rem'}">
                    {{ item.subtitle }}
                  </v-card-subtitle>

                  <v-card-actions :style="xs||sm||md?{'padding': '0','min-height': '0','height':'2.5rem'}:{'min-height': '0','height':'2.8rem'}">
                    <v-btn v-if="item.action"
                      @click="$emit('cardAction', item.action)"
                      :text= "item.go"
                    ></v-btn>
                    <v-btn v-else :href="item.url"
                    :target="item.url&&item.url.startsWith('/#')?'_self':'_blank'"
                      :text= "item.go"
                    ></v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                      :icon="item.show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                      @click="item.show = !item.show;projectcardsShow(key);"
                    ></v-btn>
                  </v-card-actions>
                  <v-expand-transition>
                    <div v-show="item.show">
                      <v-divider></v-divider>
                      <v-card-text :style="xs?{'font-size': '0.7rem'}:{}">
                        {{item.text}}
                      </v-card-text>
                    </div>
                  </v-expand-transition>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
          
        </div>       
      </div>
</template> 

<script>
import typewriter from '../components/typewriter.vue';
import turntable from '../components/turntable.vue';
import { useDisplay } from 'vuetify'

export default {
    components: {
        typewriter,turntable
    },
    props: ['configdata','formattedTime','formattedDate','projectcards','currentSong','musicPlaying','lyricLine1','lyricLine2','progress'],
	data() {
		return {
			searchQuery: '',
			selectedEngine: { title: 'Bing', value: 'bing' },
      		searchEngines :[
				{ title: 'Bing', value: 'bing' },
				{ title: 'Google', value: 'google' },
				{ title: '百度', value: 'baidu' },
				{ title: 'Yandex', value: 'yandex' },
				{ title: 'DuckDuckGo', value: 'duckduckgo' },
			]
		}
	},
    setup() {
      const { xs,sm,md } = useDisplay();
      return {xs,sm,md};
    },
	computed: {	
		isUrl(){
			const str = this.searchQuery.trim();
  			return this.isLikelyUrl(str);
		}
	},
    methods:{
      projectcardsShow(key){
        for(let i = 0;i < this.projectcards.length;i++){
          if(i != key){
            this.projectcards[i].show = false;
          }
        }
      },
	  performSearch() {
		const query = this.searchQuery.trim();
		if (!query) return;

		if (this.isUrl) {
			let url = query;
			// 自动补全协议（如果缺少）
			if (!/^[a-z]+:\/\//i.test(url)) {
				url = 'http://' + url; // 默认用http
			}
			
			window.open(url, '_blank');
		} else {
			const engineUrls = {
				google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
				bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
				baidu: `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`,
				yandex: `https://yandex.com/search/?text=${encodeURIComponent(query)}`,
				duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`
			};
			window.open(engineUrls[this.selectedEngine.value], '_blank');
		}
	  },
	  isLikelyUrl(input) {
		// 移除首尾空格
		const str = input.trim();
		
		// 情况1：明确包含协议头（http/https/ftp等）
		if (/^(https?|ftp):\/\//i.test(str)) return true;
		
		// 情况2：符合域名格式（支持国际化域名）
		const domainPattern = /^([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i;
		
		// 情况3：localhost或IP地址
		const localPattern = /^(localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(\/.*)?$/i;
		
		
		return (
			domainPattern.test(str) || 
			localPattern.test(str)
		);
		}
    }
};
</script>

<style scoped>
@import url(/css/app.less);
@import url(/css/mobile.less);
.glass-list {
	background: transparent !important;
	backdrop-filter: blur(var(--leleo-blur));
	border-radius: 5%;
	color: var(--leleo-vcard-color);
	overflow: hidden;
}
</style>