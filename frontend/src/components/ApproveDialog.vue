<template>
  <v-dialog v-model="visible" width="330" transition="dialog-bottom-transition">
    <v-card class="approve-card" rounded="xl">
      <div class="approve-hero">
        <v-icon size="30" color="white">mdi-heart</v-icon>
        <div class="approve-title">赞赏支持</div>
        <div class="approve-sub">如果这里的内容帮到了你，欢迎请我喝杯奶茶</div>
      </div>

      <div class="approve-qr-wrap">
        <div class="approve-qr">
          <v-img src="/img/approve.jpg" alt="微信赞赏码" cover>
            <template #placeholder>
              <div class="qr-ph"><v-progress-circular indeterminate size="26" color="green-darken-2" /></div>
            </template>
          </v-img>
        </div>
        <div class="approve-tip">
          <v-icon size="13">mdi-cellphone-scan</v-icon>
          手机长按识别 · 或保存后用微信扫一扫
        </div>
      </div>

      <div class="approve-foot">
        <v-icon size="15" color="#07c160">mdi-wechat</v-icon>
        <span>微信支付</span>
        <v-spacer />
        <a class="approve-close" @click="visible = false">关闭</a>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ApproveDialog',
  data() { return { visible: false }; },
  methods: { open() { this.visible = true; } },
};
</script>

<style scoped>
.approve-card {
  overflow: hidden;
  background: rgba(255, 255, 255, 0.97) !important;
  backdrop-filter: blur(24px);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.35) !important;
  border: 1px solid rgba(255, 255, 255, 0.6);
}
.approve-hero {
  background: linear-gradient(135deg, #07c160, #2e7d32);
  color: #fff;
  text-align: center;
  padding: 18px 16px 16px;
}
.approve-title { font-size: 18px; font-weight: 700; margin-top: 4px; letter-spacing: 1px; }
.approve-sub { font-size: 12px; opacity: 0.92; margin-top: 6px; line-height: 1.6; }
.approve-qr-wrap { padding: 20px 24px 8px; text-align: center; }
.approve-qr {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.10);
}
.qr-ph { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.approve-tip {
  margin-top: 10px;
  font-size: 12px;
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.approve-foot {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 20px 16px;
  font-size: 13px;
  color: #444;
}
.approve-close { color: #07c160; font-weight: 600; cursor: pointer; }
</style>
