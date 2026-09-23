<template>
  <canvas v-if="!isMobile" ref="cv" class="threeui-particles" aria-hidden="true"></canvas>
</template>

<script>
/**
 * ThreeUI 风格粒子星尘层（Three.js 点云 + 鼠标视差）
 * - 桌面端启用；手机 / prefers-reduced-motion 自动关闭
 * - three 通过动态 import 懒加载（代码分割，不增加首屏体积）
 * - 页面不可见自动暂停；组件卸载时完全清理 WebGL 资源
 */
export default {
  name: 'ParticleLayer',
  data() { return { isMobile: false }; },
  async mounted() {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isMobile = window.innerWidth < 820;
    if (reduced || this.isMobile) return;
    try {
      const THREE = await import('three');
      this.init(THREE);
    } catch (e) {
      console.warn('particle layer disabled:', e);
    }
  },
  beforeUnmount() { this.destroy(); },
  methods: {
    init(THREE) {
      const cv = this.$refs.cv;
      if (!cv) return;
      const renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: false, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.setSize(window.innerWidth, window.innerHeight);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.z = 14;

      // 星尘点云：三层深度、绿-青-白配色（贴合站内主题）
      const COUNT = 1400;
      const pos = new Float32Array(COUNT * 3);
      const col = new Float32Array(COUNT * 3);
      const palette = [
        [0.40, 0.80, 0.50],  // 绿 #66bb6a
        [0.18, 0.55, 0.30],  // 深绿 #2e7d32
        [0.55, 0.90, 0.85],  // 青
        [0.95, 0.98, 0.95],  // 白
      ];
      for (let i = 0; i < COUNT; i++) {
        const depth = Math.random();
        pos[i * 3] = (Math.random() - 0.5) * 46;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
        pos[i * 3 + 2] = -depth * 26 + 4;
        const c = palette[(Math.random() * palette.length) | 0];
        const dim = 0.45 + 0.55 * (1 - depth);
        col[i * 3] = c[0] * dim;
        col[i * 3 + 1] = c[1] * dim;
        col[i * 3 + 2] = c[2] * dim;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      const mat = new THREE.PointsMaterial({
        size: 0.09,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);

      // 鼠标视差
      let mx = 0, my = 0, tx = 0, ty = 0;
      const onMouse = (e) => {
        tx = (e.clientX / window.innerWidth - 0.5) * 2;
        ty = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener('mousemove', onMouse, { passive: true });

      const onResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', onResize);

      let running = true;
      const onVis = () => { running = !document.hidden; };
      document.addEventListener('visibilitychange', onVis);

      let raf = 0;
      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!running) return;
        const t = performance.now() * 0.001;
        mx += (tx - mx) * 0.03;
        my += (ty - my) * 0.03;
        points.rotation.y = t * 0.02 + mx * 0.12;
        points.rotation.x = my * 0.08;
        points.position.y = Math.sin(t * 0.25) * 0.35;
        mat.opacity = 0.62 + Math.sin(t * 0.8) * 0.1;
        renderer.render(scene, camera);
      };
      tick();

      this._cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('mousemove', onMouse);
        window.removeEventListener('resize', onResize);
        document.removeEventListener('visibilitychange', onVis);
        geo.dispose();
        mat.dispose();
        renderer.dispose();
      };
    },
    destroy() { if (this._cleanup) { try { this._cleanup(); } catch (e) {} this._cleanup = null; } },
  },
};
</script>

<style scoped>
.threeui-particles {
  position: fixed;
  inset: 0;
  z-index: -90;
  pointer-events: none;
  opacity: 0.9;
}
</style>
