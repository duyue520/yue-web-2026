<template>
  <v-dialog v-model="visible" width="500" :scrim="true" transition="dialog-bottom-transition">
    <v-card class="profile-dialog-glass" rounded="xl">
      <v-toolbar color="transparent" density="compact" flat>
        <v-toolbar-title class="text-body-1 font-weight-bold">
          <v-icon start color="green-darken-2">mdi-account-cog</v-icon> 个人中心
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon size="small" variant="text" @click="visible = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="pt-0">
        <UserProfile @updated="onUpdated" />
        <div class="profile-actions mt-4 pt-3" style="border-top:1px solid rgba(0,0,0,0.08)">
          <v-row dense>
            <v-col cols="6">
              <v-btn block variant="tonal" color="grey-darken-1" rounded="lg" size="small" @click="switchAccount">
                <v-icon start size="16">mdi-account-switch</v-icon> 切换账号
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn block variant="tonal" color="red-darken-1" rounded="lg" size="small" @click="doLogout">
                <v-icon start size="16">mdi-logout-variant</v-icon> 退出登录
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import UserProfile from './disease/UserProfile.vue';
import api from '../services/api.js';

export default {
  name: 'ProfileDialog',
  components: { UserProfile },
  emits: ['updated'],
  data() {
    return { visible: false };
  },
  methods: {
    open() { this.visible = true; },
    onUpdated(data) { this.$emit('updated', data); },
    switchAccount() {
      api.logout();
      this.visible = false;
      this.$emit('logout');
    },
    doLogout() {
      api.logout();
      this.visible = false;
      this.$emit('logout');
    },
  },
};
</script>

<style scoped>
.profile-dialog-glass {
  background: rgba(255, 255, 255, 0.92) !important;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.5);
}
</style>
