<template>
  <div class="gb-outer">
    <v-card class="gb-card" variant="tonal">
      <v-card-title class="pb-1">
        <span class="gb-title">💬 留言板</span>
        <v-spacer />
        <span class="gb-total">{{ messages.length }} 条留言</span>
      </v-card-title>
      <v-card-text class="pt-1">
        <div class="gb-send">
          <v-text-field
            v-model="newMsg"
            placeholder="留下你想说的话..."
            variant="outlined"
            density="compact"
            hide-details
            class="gb-input"
            bg-color="rgba(255,255,255,0.45)"
            @keyup.enter="postMessage"
          >
            <template #append-inner>
              <v-btn icon size="28" variant="flat" color="grey-darken-1" :loading="posting" @click="postMessage">
                <v-icon size="18">mdi-send</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </div>
        <div class="gb-list" v-if="messages.length > 0" ref="msgList">
          <div v-for="m in messages" :key="m.id" class="gb-item">
            <div class="gb-item-top">
              <span class="gb-nick">{{ m.nickname }}</span>
              <span class="gb-time">{{ m.created_at }}</span>
              <v-btn
                v-if="canDelete(m)"
                icon size="24" variant="text" color="red" class="gb-del"
                @click="deleteMessage(m)"
              >
                <v-icon size="18">mdi-delete</v-icon>
              </v-btn>
            </div>
            <p class="gb-text">{{ m.content }}</p>
          </div>
        </div>
        <div v-else class="gb-empty">
          <p>还没有留言，来坐沙发吧 ~</p>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import api from '../services/api.js';

export default {
  name: 'Guestbook',
  data() {
    return { newMsg: '', posting: false, messages: [], currentUserId: null, currentUsername: '' };
  },
  mounted() { this.loadMessages(); this.loadCurrentUser(); },
  methods: {
    async loadMessages() {
      try { const d = await api.getGuestbookMessages(); this.messages = d.messages || []; this.scrollToBottom(); }
      catch (e) { console.error(e); }
    },
    loadCurrentUser() {
      const u = localStorage.getItem('disease_user');
      if (u) {
        try { const p = JSON.parse(u); this.currentUserId = p.id; this.currentUsername = p.username; } catch(e) {}
      }
    },
    canDelete(m) {
      return (this.currentUserId && m.user_id === this.currentUserId)
          || (this.currentUsername && m.owner_name === this.currentUsername);
    },
    async postMessage() {
      if (!this.newMsg.trim()) return;
      this.posting = true;
      // 乐观更新：立刻显示
      const tempMsg = {
        id: Date.now(), user_id: this.currentUserId,
        nickname: '匿名', content: this.newMsg.trim(),
        created_at: new Date().toLocaleString('zh-CN', {month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).replace(/\//g,'-'),
      };
      this.messages.unshift(tempMsg);
      const msgText = this.newMsg;
      this.newMsg = '';
      try {
        await api.postGuestbookMessage('匿名', msgText);
        await this.loadMessages();
      } catch (e) {
        this.messages = this.messages.filter(m => m.id !== tempMsg.id);
        this.newMsg = msgText;
      }
      finally { this.posting = false; }
    },
    async deleteMessage(m) {
      // 乐观删除：直接从列表移除，后台静默确认
      this.messages = this.messages.filter(x => x.id !== m.id);
      try { await api.deleteGuestbookMessage(m.id); } catch (e) {}
    },
    scrollToBottom() { this.$nextTick(() => { const el = this.$refs.msgList; if (el) el.scrollTop = 0; }); },
  },
};
</script>

<style scoped>
.gb-outer { margin: 18px 12px; max-width: 960px; }
.gb-card {
  background: rgba(255,255,255,0.4) !important;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 16px !important;
  box-shadow: 0 2px 16px rgba(0,0,0,0.04);
}
.gb-title { font-weight: 700; font-size: 15px; color: #333; }
.gb-total { font-size: 12px; color: rgba(0,0,0,0.35); }
.gb-send { margin-bottom: 10px; }
.gb-input :deep(.v-field) { border-radius: 12px !important; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.gb-input :deep(input) { color: #444 !important; font-size: 13px; }
.gb-list { max-height: 280px; overflow-y: auto; }
.gb-item { padding: 8px 12px; margin-bottom: 6px; background: rgba(255,255,255,0.35); border-radius: 10px; }
.gb-item-top { display: flex; align-items: center; gap: 6px; }
.gb-nick { font-weight: 600; font-size: 13px; color: #555; }
.gb-time { font-size: 11px; color: rgba(0,0,0,0.3); }
.gb-del { margin-left: auto; }
.gb-text { color: #555; font-size: 13px; line-height: 1.5; margin: 4px 0 0; }
.gb-empty { text-align: center; padding: 20px; color: rgba(0,0,0,0.25); }
.gb-empty p { font-size: 13px; }
@media (max-width: 600px) { .gb-outer { margin: 12px 8px; } }
</style>
