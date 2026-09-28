<template>
  <v-app class="vapp-fullscreen-background" style="overflow: hidden;" :class="{ 'radius-before': !xs }"
  :style="xs?{height: '100%',width: '100%',top: '0',left:'0'}:(sm?{height: '98%',width: '98%',top: '1%',left:' 1%'}:{height: '96.6%',width: '99%',top: '1.7%',left:' 0.5%'})">
    <transition name="fade">
      <div class="loading" v-show="isloading">
        <loader></loader>
      </div>
    </transition>

    <!-- 登录门禁 -->
    <LoginGate v-if="!isloading && showLoginGate" :avatar="configdata.avatar" @done="onGateDone" />

    <!-- 越的分身：呼吸光点 + 侧滑对话（全局可用） -->
    <AiChat v-if="!isloading" ref="aiChat" :avatar="configdata.avatar" />

    <!-- 备案信息（首页可见，链接工信部） -->
    <div v-show="!isloading && !isClearScreen" class="wb-icp">
      <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">
        {{ (configdata.statement && configdata.statement[0] || '').replace('备案号：', '') }}
      </a>
      <span class="wb-icp-dot">·</span>
      <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">工信部备案</a>
    </div>

    <video autoplay loop muted playsinline class="video-bg" id="bg-video" ref="VdPlayer" :src="videosrc"
    :poster="videosrc ? videosrc.replace(/\.(webm|mp4)$/i, '-poster.webp') : ''"
    :style="xs?{height: '100%',width: '100%',top: '0',left:'0'}:(sm?{height: '98%',width: '98%',top: '1%',left:' 1%','border-radius': '16px'}:{height: '96.6%',width: '99%',top: '1.7%',left:' 0.5%','border-radius': '16px',})">
        <!-- 视频源由 <video> 的 :src 直接绑定：改 source 子元素不会触发重新加载 -->
    </video>

    <!-- ThreeUI 风格粒子星尘层（桌面端，懒加载 three） -->
    <ParticleLayer v-if="chartReady" />

    <div class="floating-switch-container">
      <v-switch
        v-model="isClearScreen"
        inset
        :style="xs?{'transform':'scale(0.6) translateX(15%)'}:{}"
        class="floating-switch"
        @mouseover="expandSwitch"
        @mouseleave="collapseSwitch"
      ></v-switch>
    </div>
    
    <div v-show="!isloading && !isClearScreen" :style="xs||sm?{'overflow-y': 'auto','overflow-x': 'hidden'}:{}">
        <v-row>
            <v-col cols="12" md="4" lg="3" class="leleo-left" align="center">
              <div :style="xs||sm?{'font-size':'2.3rem'}:{'display':'none'}" class="leleo-left-welcome">{{ configdata.welcometitle }}</div>  
              <v-avatar class="leleo-left-avatar" :size="xs||sm?120:140" :style="xs||sm?{'margin-top': '0'}:{'margin-top': '2rem'}" @mouseenter="musicplayershow(1)" @mouseleave="musicplayershow(0)">
                  <v-img :class="{'leleo-spin':isPlaying}"
                  alt="Leleo"
                  :src=configdata.avatar
                  ></v-img>
                  <!-- 由于当ismusicplayer显示后，fadein无效果，所以需要设置一个过渡动画 -->
                  <transition name="fade">
                  <v-card v-show="ismusicplayer" class="musicplayer" :class="{'fade-in':ismusicplayer}" variant="tonal">
                      <div v-if="audioLoading" class="loading-spinner">
                          <v-progress-circular indeterminate></v-progress-circular>
                      </div>
                      <span ref="audiotitle" class="musicplayer-text"
                        style="top: 1.6rem;font-weight: bolder;"
                      >{{ musicinfo?.[0]?.title }}</span>
                      <span ref="audioauthor" class="musicplayer-text"
                        style="bottom: 1.4rem;"
                      >{{ musicinfo?.[0]?.author }}</span>
                      <audio v-show="false" ref="audioPlayer" id="wb-audio" :src="musicinfo?.[0]?.url"
                      preload="auto" crossorigin="anonymous"
                      @waiting="onWaiting"
                      @canplay="onCanPlay"
                      @stalled="onWaiting"
                      @suspend="onCanPlay">
                      </audio>
                      <v-btn :size="xs||sm?22:30" color="#999999" icon @click="previousTrack()">
                      <v-icon>mdi-skip-previous</v-icon>
                      </v-btn>
                      <v-btn :size="xs||sm?35:48" color="#999999" icon @click="togglePlay()">
                      <v-icon>{{ isPlaying? 'mdi-pause' : 'mdi-play' }}</v-icon>
                      </v-btn>
                      <v-btn :size="xs||sm?22:30" color="#999999" icon @click="nextTrack()">
                      <v-icon>mdi-skip-next</v-icon>
                      </v-btn>
                  </v-card>
                  </transition>
                </v-avatar>

                <v-card class="ma-5 pa-2 leleo-left-card" variant="tonal" :max-width="xs?270:300" style="text-align: center;">
                    <template v-slot:title>
                    <span>Tags</span>
                    </template>
                    <v-chip v-for="item in personalizedtags" density="compact" link class="ma-1" size="small">
                    {{item}}
                    </v-chip>
                </v-card>

                <div class="leleo-left-chart">
                    <polarchart v-if="chartReady" :style="xs||sm?{'height':'210px'}:{'height':'270px'}"/>
                    <div v-else class="wb-lazy-slot"><v-progress-circular indeterminate size="22" width="2"></v-progress-circular></div>
                </div>

                <v-container class="leleo-left-socialIconsContainer">
                    <v-row align="center" justify="center">
                    <v-col class="pa-1" cols="auto" v-for="item in socialPlatformIcons">
                        <!-- 赞赏：带文字标签，让访客一眼知道这是赞赏入口 -->
                        <v-btn v-if="item.action === 'approve'"
                        :size="xs?34:40" variant="flat" rounded="pill"
                        class="ma-1 leleo-approve-btn"
                        prepend-icon="mdi-heart"
                        @click="$refs.approveDialog.open()">
                        {{ item.label || '赞赏' }}
                        </v-btn>
                        <v-btn v-else :size="xs?25:33" variant="tonal" color="var(--leleo-vcard-color)"
                        class="ma-1 leleo-social-bticon"
                        icon
                        :href="item.link || undefined" :target="item.link ? '_blank' : undefined">
                    <v-icon :icon=item.icon :size="xs?20:25" class="social-bticon-icon"></v-icon></v-btn>
                    </v-col>
                    </v-row>

                    <v-row align="center" justify="center" class="setting">
                    <v-col class="ma-1" cols="auto">
                        <v-fab class="leleo-action-fab leleo-fab-music" color="var(--leleo-vcard-color)"
                        variant="tonal" icon="mdi-music-circle" @click="$refs.musicDialog.open()"></v-fab>
                    </v-col>
                    <v-col class="ma-1" cols="auto">
                        <v-fab v-if="isUserLoggedIn" class="leleo-action-fab" color="var(--leleo-vcard-color)"
                        variant="tonal" icon="mdi-account-circle" @click="$refs.profileDialog.open()"></v-fab>
                    </v-col>
                    <v-col class="ma-1" cols="auto">
                        <v-speed-dial
                            :location="xs||sm ?'top center':'right center'"
                            transition="slide-y-transition"
                        >
                        <template v-slot:activator="{ props: activatorProps }">
                            <v-fab class="leleo-action-fab" color="var(--leleo-vcard-color)"
                            variant="tonal"
                            v-bind="activatorProps"
                            icon="mdi-cog"
                            ></v-fab>
                        </template>
                        <v-btn variant="tonal" class="setbtn" key="1" icon="mdi-key-chain" @click="dialog1 = true" size="31" color="var(--leleo-vcard-color)"></v-btn>
                        <v-btn variant="tonal" class="setbtn" key="2" icon="mdi-information" @click="dialog2 = true" size="31" color="var(--leleo-vcard-color)"></v-btn>
                        <v-btn variant="tonal" class="setbtn" key="3" icon="$error" size="31" color="var(--leleo-vcard-color)"></v-btn>
                        </v-speed-dial>
                    </v-col>
                    </v-row>
                </v-container>
            </v-col>

            <v-col cols="12" md="8" lg="9" style="height: 100vh;" :style="xs||sm ?{}:{'overflow': 'auto'}">
                <homeright :configdata=configdata :formattedTime=formattedTime
                :formattedDate=formattedDate :projectcards=projectcards
                :currentSong="currentMusicSong" :musicPlaying="musicIsPlaying"
                @cardAction="handleCardAction"
                @musicPrev="previousTrack" @musicToggle="togglePlay" @musicNext="nextTrack"
                @openPlayer="openMusicPlayer"></homeright>
                <Guestbook />
            </v-col>
        </v-row>
    </div>

    <v-dialog
        v-model="dialog1"
        width="1000"
        heihght="700"
      >
      <v-card elevation="3" style="backdrop-filter: blur(10px);">
        <v-tabs
          v-model="tab"
          :items="tabs"
          align-tabs="center"
          height="60"
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
              <div v-if="item.value=='tab-3' && musicinfoLoading" class="loading-spinner" align="center">
                  <v-progress-circular indeterminate></v-progress-circular>
              </div>
              <!-- 通过组件绑定不同tab项的组件 -->
              <component v-if="item.value!='tab-3' || (item.value=='tab-3' && !musicinfoLoading)" :is=item.component @cancel="handleCancel" 
              :musicinfo="item.value=='tab-3'?musicinfo:[]"
              :currentIndex="item.value=='tab-3'?playlistIndex:null"
              :isPlaying="item.value=='tab-3'?isPlaying:null"
              :audioPlayer="item.value=='tab-3'?audioPlayer:null"
              :fromLyrics="item.value=='tab-3'?lyrics:null"
              :audioLoading="item.value=='tab-3'?audioLoading:null"
              @update:current-index="updateCurrentIndex"
              @update:is-playing="updateIsPlaying"
              @update:current-lyrics="updateLyrics"
              ></component>
            </v-tabs-window-item>
          </template>
        </v-tabs>
      </v-card>
      </v-dialog>

      <v-dialog
        v-model="dialog2"
        width="700"
        heihght="500"
      >
      <v-card class="ma-3 pa-2" hover
          variant="tonal"
          rounded="lg"
          style="text-align: center;backdrop-filter: blur(10px);"
        >
          <template v-slot:title >
            <span class="leleo-card-title">关于</span>
          </template>
          <div style="display: flex;flex-direction: column;align-items: center;">
            <v-card class="ma-3 pa-2" hover
              variant="tonal"
              max-width="400"
              rounded="lg"
              style="text-align: center;"
              >
              <template v-slot:subtitle>
                <span class="leleo-card-subtitle">本页基于以下技术及服务搭建</span>
              </template>
              <div>
                <v-tooltip  v-for="item in stackicons" v-model="item.model" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn icon v-bind="props" :color=item.color rounded="lg" class="ma-1 stack-btn" size="35">
                      <v-icon size="25" color="white">{{item.icon}}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{item.tip}}</span>
                </v-tooltip>
                <!-- 自定义 -->
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" rounded="lg" class="ma-1 stack-btn" size="35">
                      <v-avatar image="/img/stackicon/vite.svg" rounded="0" size="23"></v-avatar>
                    </v-btn>
                  </template>
                  <span>vite</span>
                </v-tooltip>
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" rounded="lg" class="ma-1 stack-btn" size="35" color="#254B7C">
                      <span style="font-size: 8px;font-weight: bolder;">{less}</span>
                    </v-btn>
                  </template>
                  <span>less</span>
                </v-tooltip>
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" rounded="lg" class="ma-1 stack-btn" size="35">
                      <v-avatar image="/img/stackicon/mdi.svg" rounded="0" size="35"></v-avatar>
                    </v-btn>
                  </template>
                  <span>mdi</span>
                </v-tooltip>
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" rounded="lg" class="ma-1 stack-btn" size="35">
                      <v-avatar image="/img/stackicon/chartjs.png" rounded="0" size="23"></v-avatar>
                    </v-btn>
                  </template>
                  <span>chartjs</span>
                </v-tooltip>
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" rounded="lg" class="ma-1 stack-btn" size="35" color="#0F1225">
                      <v-avatar image="/img/stackicon/meting.png" rounded="0" size="23"></v-avatar>
                    </v-btn>
                  </template>
                  <span>meting</span>
                </v-tooltip>
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" rounded="lg" class="ma-1 stack-btn" size="35" color="#070707">
                      <v-avatar image="/img/stackicon/uiverse.png" rounded="0" size="23"></v-avatar>
                    </v-btn>
                  </template>
                  <span>uiverse</span>
                </v-tooltip>
              </div>
            </v-card>

            <p class="ma-6">
                <span v-for="item in configdata.statement">
                  {{ item }}<br>
                </span>
            </p>
          </div>
        </v-card>
    </v-dialog>

    <!-- 叶片病害诊断对话框 -->
    <DiseaseMain ref="diseaseMain" @askAi="onAskAi" />

    <!-- 个人中心对话框 -->
    <ProfileDialog ref="profileDialog" @updated="onProfileUpdated" @logout="onUserLogout" />
    <MusicDialog ref="musicDialog" :musicinfo="musicinfo" :currentIndex="playlistIndex" :playing="isPlaying" :progress="musicProgress" :currentLyric="musicLyric1" :currentTime="musicCurrentTime" :duration="musicDuration"
      @prev="previousTrack" @toggle="togglePlay" @next="nextTrack" @play="updateCurrentIndex" @seek="musicSeek" @playonline="playOnlineSong" @mode="onPlayMode" />
    <BlogPage ref="blogPage" />
    <ApproveDialog ref="approveDialog" />
    <AiGateway ref="aiGateway" :avatar="configdata.avatar" />
  </v-app>
</template>

<script src="./app.js"></script>
<style scoped>
  @import url(/css/app.less);
  @import url(/css/mobile.less);
</style>