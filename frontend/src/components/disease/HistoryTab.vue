<template>
  <div class="history-root">
    <div class="glass-card hist-header-bar">
      <h3 class="hist-title"><v-icon color="green-darken-2" start size="24">mdi-history</v-icon> 诊断历史 ({{ total }} 条)</h3>
      <div class="hist-actions">
        <v-btn v-if="total > 0" variant="tonal" color="red" size="small" rounded="lg" @click="deleteAll">
          <v-icon start size="16">mdi-delete-sweep</v-icon> 清空
        </v-btn>
        <v-btn variant="tonal" color="green-darken-2" size="small" rounded="lg" class="ml-2" prepend-icon="mdi-download" @click="exportExcel">导出</v-btn>
      </div>
    </div>

    <div v-if="records.length === 0" class="glass-card hist-empty">
      <v-icon size="48" color="grey-lighten-1">mdi-leaf-off</v-icon>
      <p>暂无诊断记录</p>
      <p class="hist-empty-sub">快去拍张叶片照片吧！</p>
    </div>

    <div v-else class="hist-grid">
      <div v-for="r in records" :key="r.id" class="glass-card hist-card">
        <img v-if="r.image_base64" :src="'data:image/jpeg;base64,' + r.image_base64" class="hist-thumb" />
        <div class="hist-info">
          <div class="hist-disease">{{ r.top1_disease }}</div>
          <div class="hist-date">{{ r.created_at?.slice(0, 16) }}</div>
          <div class="hist-chips">
            <v-chip size="x-small" :color="r.is_healthy ? 'green' : 'red'" pill>{{ r.is_healthy ? '健康' : '病害' }}</v-chip>
            <v-chip v-if="r.severity" size="x-small" variant="tonal" :color="{mild:'green',moderate:'orange',severe:'red'}[r.severity]" pill class="ml-1">{{ {mild:'轻度',moderate:'中度',severe:'重度'}[r.severity] }}</v-chip>
          </div>
          <v-btn size="x-small" variant="tonal" color="green-darken-2" class="mt-1" @click="deleteOne(r)">删除</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../services/api.js';
export default {
  name: 'HistoryTab',
  data() { return { records: [], total: 0 }; },
  mounted() { this.loadHistory(); },
  activated() { this.loadHistory(); },
  methods: {
    async loadHistory() {
      // 先从本地缓存秒显
      try {
        const cached = localStorage.getItem('disease_history');
        if (cached) { const d = JSON.parse(cached); this.records = d.records; this.total = d.total; }
      } catch(e) {}
      // 后台同步最新
      try {
        const d = await api.getHistory();
        this.records = d.records; this.total = d.total;
        localStorage.setItem('disease_history', JSON.stringify({ records: d.records, total: d.total, time: Date.now() }));
      } catch (e) { console.error(e); }
    },
    async deleteOne(r) {
      this.records = this.records.filter(x => x.id !== r.id);
      this.total--;
      this.syncCache();
      try { await api.deleteHistoryRecord(r.id); } catch(e) {}
    },
    async deleteAll() {
      if (!confirm('确定删除全部诊断历史？')) return;
      this.records = []; this.total = 0;
      this.syncCache();
      try { await api.deleteAllHistory(); } catch(e) {}
    },
    syncCache() {
      // 只缓存最近20条，防止localStorage膨胀
      const slim = this.records.slice(0, 20).map(r => ({ id: r.id, top1_disease: r.top1_disease, top1_confidence: r.top1_confidence, is_healthy: r.is_healthy, severity: r.severity, severity_percent: r.severity_percent, created_at: r.created_at }));
      try { localStorage.setItem('disease_history', JSON.stringify({ records: slim, total: this.total, time: Date.now() })); } catch(e) {}
    },
    async exportExcel() { try { await api.exportExcel(); } catch(e) { alert('导出失败'); } },
  },
};
</script>

<style scoped>
.history-root { max-width: 960px; margin: 0 auto; }
.glass-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  color: #333;
}
.hist-header-bar { display: flex; align-items: center; justify-content: space-between; }
.hist-title { color: #333; font-size: 18px; display: flex; align-items: center; }
.hist-actions { display: flex; align-items: center; }
.hist-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
.hist-card { display: flex; flex-direction: column; position: relative; }
.hist-thumb { width: 100%; height: 120px; object-fit: cover; border-radius: 10px; margin-bottom: 10px; }
.hist-disease { color: #333; font-weight: 600; font-size: 14px; }
.hist-date { color: rgba(0,0,0,0.35); font-size: 11px; margin: 4px 0; }
.hist-chips { margin-top: 6px; }
.hist-empty { text-align: center; color: rgba(0,0,0,0.5); padding: 40px; }
.hist-empty-sub { font-size: 13px; margin-top: 4px; }
@media (max-width: 600px) { .hist-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
