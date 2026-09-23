<template>
  <div class="help-root">
    <!-- 新手指南 -->
    <div class="glass-card">
      <h3 class="help-title"><v-icon start color="green-darken-2" size="24">mdi-school</v-icon> 新手指南</h3>
      <p class="help-sub">只需 3 步，AI 帮你识别作物病害</p>

      <div class="steps">
        <div v-for="(s, i) in steps" :key="i" class="step-card">
          <div class="step-num">{{ i + 1 }}</div>
          <div class="step-body">
            <div class="step-icon">{{ s.icon }}</div>
            <div class="step-content">
              <h4>{{ s.title }}</h4>
              <p>{{ s.desc }}</p>
              <img v-if="s.img" :src="s.img" class="step-img" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 拍照技巧 -->
    <div class="glass-card mt-3">
      <h3 class="help-title"><v-icon start color="orange-darken-2" size="24">mdi-camera-image</v-icon> 拍照技巧</h3>
      <div class="tips">
        <div v-for="t in tips" :key="t.title" class="tip-item">
          <v-icon :color="t.color" size="20">{{ t.icon }}</v-icon>
          <div>
            <strong>{{ t.title }}</strong>
            <p>{{ t.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 结果解读 -->
    <div class="glass-card mt-3">
      <h3 class="help-title"><v-icon start color="blue-darken-2" size="24">mdi-chart-bar</v-icon> 结果怎么看</h3>
      <div class="result-guide">
        <div class="rg-item">
          <v-chip color="green" size="small" pill>绿色</v-chip>
          <span>健康 — 叶片正常，继续保持</span>
        </div>
        <div class="rg-item">
          <v-chip color="red" size="small" pill>红色</v-chip>
          <span>病害 — 查看下方防治建议及时处理</span>
        </div>
        <div class="rg-item">
          <v-chip color="orange" size="small" pill>中度</v-chip>
          <span>病斑面积 5%~20%，建议尽快喷药</span>
        </div>
        <div class="rg-item">
          <span class="rg-label">Top-1 置信度 > 90%</span>
          <span>基本确诊，按建议处理</span>
        </div>
        <div class="rg-item">
          <span class="rg-label">Top-1 置信度 < 70%</span>
          <span>建议换角度重拍或咨询专家</span>
        </div>
      </div>
    </div>

    <!-- 常见问题 -->
    <div class="glass-card mt-3">
      <h3 class="help-title"><v-icon start color="purple-darken-2" size="24">mdi-frequently-asked-questions</v-icon> 常见问题</h3>
      <v-expansion-panels variant="accordion" class="faq-panels">
        <v-expansion-panel v-for="q in faq" :key="q.q">
          <v-expansion-panel-title class="faq-q">
            <v-icon start size="16" color="green-darken-2">mdi-help-circle</v-icon>
            {{ q.q }}
          </v-expansion-panel-title>
          <v-expansion-panel-text class="faq-a">{{ q.a }}</v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelpGuide',
  data() {
    return {
      steps: [
        { icon: '📸', title: '拍摄或上传叶片照片', desc: '手机打开网站自动调摄像头，对准病害叶片拍清晰照片。电脑端可拖拽图片上传，支持 JPG/PNG/WebP 格式。' },
        { icon: '🤖', title: '模型分析', desc: '上传后等待 1~3 秒，ResNet18 深度学习模型会对 39 种病害进行识别，分析病斑特征。' },
        { icon: '📋', title: '查看诊断结果', desc: '获得 Top-3 预测结果、置信度评分、严重度评估、防治建议。可保存历史或导出 Excel。' },
      ],
      tips: [
        { icon: 'mdi-image-filter-center-focus', color: 'green-darken-2', title: '叶片居中拍摄', desc: '让病害叶片占画面 60% 以上，避免背景杂乱' },
        { icon: 'mdi-white-balance-sunny', color: 'orange-darken-2', title: '自然光下拍摄', desc: '白天室外自然光最佳，避免强闪光和阴影遮挡' },
        { icon: 'mdi-blur-off', color: 'blue-darken-2', title: '保持清晰', desc: '手持稳定，避免模糊。病斑细节对识别很重要' },
        { icon: 'mdi-checkbox-multiple-blank', color: 'purple-darken-2', title: '一片一病', desc: '每张照片拍一片叶子，不要多片重叠' },
      ],
      faq: [
        { q: '识别不准怎么办？', a: '可能原因：①叶片太小或模糊→靠近重拍；②病害不在39类中→使用"纠错"功能反馈；③光线太暗→自然光下重拍。也可以换个角度再试一次。' },
        { q: '为什么显示"健康"但叶片有斑点？', a: '模型判断为健康叶片，可能斑点属于正常纹理变化或轻微损伤。如果确认是病害，请使用"纠错"功能告诉我们正确的病害名称。' },
        { q: '严重度是怎么算的？', a: '通过分析 HSV 颜色空间中绿色（健康组织）与非绿色（病变组织）的面积比。轻度<5%，中度5~20%，重度>20%。仅供参考，精确诊断请咨询农技专家。' },
        { q: '支持哪些作物？', a: '目前支持 14 种作物：苹果、蓝莓、樱桃、玉米、葡萄、柑橘、桃、甜椒、马铃薯、覆盆子、大豆、南瓜、草莓、番茄，共 39 种病害/健康状态。' },
        { q: '上传的照片会泄露吗？', a: '不会。照片仅用于本次诊断推理，服务器不存储原始图片，推理完成后立即从内存中清除。历史记录只保存压缩缩略图。' },
      ],
    };
  },
};
</script>

<style scoped>
.help-root { max-width: 800px; margin: 0 auto; }
.glass-card {
  background: rgba(255,255,255,0.78);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  color: #333;
}
.help-title { font-size: 18px; margin-bottom: 6px; display: flex; align-items: center; color: #333; }
.help-sub { color: rgba(0,0,0,0.45); font-size: 13px; margin-bottom: 16px; }

.steps { display: flex; flex-direction: column; gap: 16px; }
.step-card {
  display: flex; gap: 14px;
  background: rgba(0,0,0,0.02); border-radius: 14px; padding: 18px;
}
.step-num {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, #4caf50, #2e7d32);
  color: #fff; font-weight: 700; font-size: 18px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.step-body { flex: 1; }
.step-icon { font-size: 28px; margin-bottom: 4px; }
.step-content h4 { font-size: 15px; color: #333; margin: 0 0 4px; }
.step-content p { font-size: 13px; color: #666; line-height: 1.6; margin: 0; }
.step-img { max-width: 100%; border-radius: 8px; margin-top: 8px; }

.tips { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.tip-item { display: flex; gap: 10px; padding: 12px; background: rgba(0,0,0,0.02); border-radius: 12px; }
.tip-item strong { font-size: 13px; color: #333; display: block; }
.tip-item p { font-size: 12px; color: #888; margin: 2px 0 0; line-height: 1.5; }

.result-guide { display: flex; flex-direction: column; gap: 10px; }
.rg-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #555; }
.rg-label { background: rgba(0,0,0,0.05); padding: 2px 8px; border-radius: 6px; font-weight: 500; font-size: 12px; color: #333; }

.faq-panels { background: transparent !important; }
.faq-panels :deep(.v-expansion-panel) { background: rgba(0,0,0,0.02) !important; border-radius: 10px !important; margin-bottom: 6px; }
.faq-q { font-size: 14px !important; color: #333 !important; }
.faq-a { font-size: 13px !important; color: #666 !important; line-height: 1.7; }

@media (max-width: 600px) {
  .tips { grid-template-columns: 1fr; }
  .glass-card { padding: 16px; }
}
</style>
