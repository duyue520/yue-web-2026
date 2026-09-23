<template>
  <div class="auth-glass-card">
    <!-- Tab 切换 -->
    <div class="auth-tabs">
      <button :class="['auth-tab', { active: !isRegister }]" @click="isRegister = false; error = ''">
        <v-icon size="18">mdi-login</v-icon> 登录
      </button>
      <button :class="['auth-tab', { active: isRegister }]" @click="isRegister = true; error = ''">
        <v-icon size="18">mdi-account-plus</v-icon> 注册
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="auth-form">
      <!-- 头像装饰 -->
      <div class="auth-avatar">
        <v-avatar size="72" color="green">
          <v-icon size="40" color="white">mdi-leaf</v-icon>
        </v-avatar>
      </div>

      <v-text-field
        v-model="username"
        label="用户名"
        variant="outlined"
        prepend-inner-icon="mdi-account-outline"
        density="comfortable"
        class="light-input"
        hide-details="auto"
        :rules="[v => !!v || '请输入用户名']"
        color="green-darken-2"
        base-color="grey-darken-2"
      />

      <v-text-field
        v-model="password"
        label="密码"
        variant="outlined"
        prepend-inner-icon="mdi-lock-outline"
        density="comfortable"
        class="light-input"
        :type="showPwd ? 'text' : 'password'"
        :append-inner-icon="showPwd ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPwd = !showPwd"
        hide-details="auto"
        :rules="[v => (v && v.length >= 6) || '密码至少6位']"
        color="green-darken-2"
        base-color="grey-darken-2"
      />

      <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mt-2" closable @click:close="error = ''">
        {{ error }}
      </v-alert>

      <v-btn
        block
        size="x-large"
        type="submit"
        :loading="loading"
        variant="flat"
        color="green-darken-2"
        class="auth-submit-btn mt-4"
        rounded="lg"
      >
        <v-icon start>{{ isRegister ? 'mdi-account-plus' : 'mdi-login' }}</v-icon>
        {{ isRegister ? '创建账号' : '立即登录' }}
      </v-btn>

      <p class="auth-hint">
        {{ isRegister ? '已有账号？' : '没有账号？' }}
        <a @click.prevent="isRegister = !isRegister; error = ''">
          {{ isRegister ? '去登录' : '免费注册' }}
        </a>
      </p>
    </form>
  </div>
</template>

<script>
import api from '../../services/api.js';

export default {
  name: 'AuthCard',
  emits: ['login-success'],
  data() {
    return {
      isRegister: false,
      username: '',
      password: '',
      showPwd: false,
      loading: false,
      error: '',
    };
  },
  methods: {
    async handleSubmit() {
      this.loading = true;
      this.error = '';
      try {
        if (this.isRegister) {
          await api.register(this.username, this.password);
        } else {
          await api.login(this.username, this.password);
        }
        this.$emit('login-success', api.getUser());
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.auth-glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  padding: 32px 28px 24px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
}

.auth-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 24px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 12px;
  padding: 4px;
}
.auth-tab {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: rgba(0, 0, 0, 0.5);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.auth-tab.active {
  background: white;
  color: #2e7d32;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.auth-avatar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.light-input :deep(.v-field) {
  border-radius: 12px !important;
  background: rgba(255, 255, 255, 0.7) !important;
}
.light-input :deep(.v-field__outline) {
  --v-field-border-opacity: 0.25;
}
.light-input :deep(.v-label) {
  color: rgba(0, 0, 0, 0.55);
}
.light-input :deep(input) {
  color: #333;
}

.auth-submit-btn {
  height: 52px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  letter-spacing: 1px;
  box-shadow: 0 4px 16px rgba(46, 125, 50, 0.3) !important;
}

.auth-hint {
  text-align: center;
  color: rgba(0, 0, 0, 0.45);
  font-size: 13px;
  margin-top: 4px;
}
.auth-hint a {
  color: #2e7d32;
  cursor: pointer;
  font-weight: 600;
}
</style>
