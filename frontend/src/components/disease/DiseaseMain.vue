<template>
  <v-dialog v-model="visible" fullscreen :scrim="false" transition="dialog-bottom-transition">
    <div class="disease-overlay">
      <!-- 顶栏 -->
      <v-toolbar class="disease-toolbar" density="compact" color="transparent" flat>
        <v-toolbar-title class="text-h6 font-weight-bold">
          <v-icon start size="28" color="green">mdi-leaf-circle</v-icon>
          <span class="text-green-accent-3">叶片病害智能诊断</span>
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon size="small" variant="text" @click="close" title="关闭">
          <v-icon size="28">mdi-close-circle</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- 内容区 -->
      <div class="disease-content">
        <!-- 未登录 -->
        <div v-if="!isLoggedIn" class="auth-center">
          <div class="auth-wrapper">
            <div class="auth-header text-center mb-4">
              <v-icon size="48" color="green">mdi-leaf-circle-outline</v-icon>
              <h2 class="text-h4 mt-2">🌿 作物病害智能诊断</h2>
              <p class="text-body-1 text-grey-lighten-1 mt-1">AI 识别 39 种病害 · 秒级诊断 · 防治建议</p>
            </div>
            <auth-card @login-success="onLoginSuccess" />
          </div>
        </div>

        <!-- 已登录：Tab -->
        <div v-else class="tabs-wrapper">
          <v-tabs v-model="tab" color="green-accent-3" slider-color="green-accent-3" class="mb-3" density="comfortable">
            <v-tab value="diagnosis" prepend-icon="mdi-camera">
              <span class="tab-label">诊断</span>
            </v-tab>
            <v-tab value="history" prepend-icon="mdi-history">
              <span class="tab-label">历史</span>
            </v-tab>
            <v-tab value="feedback" prepend-icon="mdi-message-text">
              <span class="tab-label">反馈</span>
            </v-tab>
            <v-tab value="help" prepend-icon="mdi-help-circle">
              <span class="tab-label">帮助</span>
            </v-tab>
          </v-tabs>

          <v-window v-model="tab" class="tab-window">
            <v-window-item value="diagnosis">
              <diagnosis-tab ref="diagnosisTab" @diagnosed="onDiagnosed" />
            </v-window-item>
            <v-window-item value="history">
              <history-tab ref="historyTab" :key="'hist-'+historyKey" />
            </v-window-item>
            <v-window-item value="feedback">
              <feedback-tab />
            </v-window-item>
            <v-window-item value="help">
              <help-guide />
            </v-window-item>
          </v-window>
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import api from '../../services/api.js';
import AuthCard from './AuthCard.vue';
import DiagnosisTab from './DiagnosisTab.vue';
import HistoryTab from './HistoryTab.vue';
import FeedbackTab from './FeedbackTab.vue';
import HelpGuide from './HelpGuide.vue';
export default {
  name: 'DiseaseMain',
  components: { AuthCard, DiagnosisTab, HistoryTab, FeedbackTab, HelpGuide },
  data() {
    return {
      visible: false,
      tab: 'diagnosis',
      historyKey: 0,
      isLoggedIn: false,
      user: null,
      userAvatar: '',
    };
  },
  watch: {
    tab(val) {
      if (val === 'history') {
        this.historyKey++;
        // 立即触发子组件刷新
        this.$nextTick(() => {
          const histRef = this.$refs.historyTab;
          if (histRef && histRef.loadHistory) histRef.loadHistory();
        });
      }
    },
  },
  methods: {
    open() {
      this.visible = true;
      this.isLoggedIn = api.isLoggedIn();
      this.user = api.getUser();
      if (this.isLoggedIn) {
        api.fetchUserInfo().then(u => {
          this.user = u;
          localStorage.setItem('disease_user', JSON.stringify(u));
        }).catch(() => {});
        this.loadAvatar();
      }
    },
    close() {
      this.visible = false;
      this.tab = 'diagnosis';
      window.location.hash = '';
      // 重置诊断子组件状态，下次打开时显示干净的上传区
      const diagRef = this.$refs.diagnosisTab;
      if (diagRef && diagRef.reset) diagRef.reset();
    },
    async loadAvatar() {
      try {
        const p = await api.getProfile();
        if (p.avatar_base64) this.userAvatar = 'data:image/jpeg;base64,' + p.avatar_base64;
      } catch (e) {}
    },
    onDiagnosed() {
      this.historyKey++;
      // 清除历史缓存，下次加载时重新拉取
      try { localStorage.removeItem('disease_history'); } catch(e) {}
    },
    onLoginSuccess(userData) {
      this.isLoggedIn = true;
      this.user = userData || api.getUser();
      this.tab = 'diagnosis';
      this.loadAvatar();
    },
  },
};
</script>

<style scoped>
.user-chip { cursor: pointer !important; font-size: 14px; padding: 0 4px; }
.user-chip:hover { background: rgba(76,175,80,0.3) !important; }
.user-name { max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.user-menu { background: rgba(30,30,30,0.95) !important; backdrop-filter: blur(16px); min-width: 140px; }
.user-menu :deep(.v-list-item) { color: #fff; }
.user-menu :deep(.v-list-item:hover) { background: rgba(255,255,255,0.08); }

.disease-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}
.disease-toolbar {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.7) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding: 0 16px;
}
.disease-toolbar :deep(.v-toolbar-title) { color: #333; }
.disease-toolbar :deep(.v-toolbar-title .text-green-accent-3) { color: #2e7d32 !important; }
.disease-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 40px;
}
.auth-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 20px;
}
.auth-wrapper {
  width: 100%;
  max-width: 420px;
}
.tabs-wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 16px;
}
.tab-label {
  font-size: 14px;
  font-weight: 500;
}
.tab-window {
  background: transparent !important;
}

/* 手机适配 */
@media (max-width: 600px) {
  .disease-toolbar {
    padding: 0 8px;
  }
  .tabs-wrapper {
    padding: 0 8px;
  }
  .auth-wrapper {
    max-width: 100%;
    padding: 0 12px;
  }
}
</style>
