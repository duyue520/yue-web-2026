#!/usr/bin/env python
"""
predict_service_fast 端到端自测：真实走一遍「载图 -> 预处理 -> 推理 -> 后处理」全链路。

server.config 是 fail-closed 的（缺 DATABASE_URL/SECRET_KEY 直接抛错），
本脚本只做推理链路验证、不连库，所以在 import 之前补占位环境变量。

用法：
    python tools/test_fast_service.py
"""
import io
import os
import sys
import time

# ---- 必须在 import server.config 之前设置 ----
os.environ.setdefault('DATABASE_URL', 'postgresql://t:t@127.0.0.1:5432/t?sslmode=require')
os.environ.setdefault('SECRET_KEY', 'test-only-placeholder-secret-key-0123456789abcdef')
os.environ.setdefault('CORS_ORIGINS', 'https://localhost')

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, PROJECT_DIR)

import numpy as np            # noqa: E402
from PIL import Image         # noqa: E402


def make_leaf_jpeg(seed=0, size=(640, 480)) -> bytes:
    """合成一张"像叶片"的图：绿色底 + 斑点 + 少量背景，压成 JPEG 字节。"""
    rng = np.random.default_rng(seed)
    w, h = size
    a = np.zeros((h, w, 3), dtype=np.float32)
    a[..., 0] = 0.28 + rng.normal(0, 0.03, (h, w))
    a[..., 1] = 0.52 + rng.normal(0, 0.05, (h, w))
    a[..., 2] = 0.22 + rng.normal(0, 0.03, (h, w))
    # 随机病斑
    for _ in range(rng.integers(3, 12)):
        cy, cx = rng.integers(0, h), rng.integers(0, w)
        r = int(rng.integers(8, 40))
        yy, xx = np.ogrid[:h, :w]
        m = (yy - cy) ** 2 + (xx - cx) ** 2 <= r * r
        a[m] = [0.55, 0.42, 0.12]
    a = np.clip(a, 0, 1)
    img = Image.fromarray((a * 255).astype(np.uint8))
    buf = io.BytesIO()
    img.save(buf, format='JPEG', quality=88)
    return buf.getvalue()


def main():
    print('=' * 62)
    from server.services import predict_service_fast as fast
    print('导入 predict_service_fast 成功')

    t0 = time.time()
    fast.load_model()
    print('load_model() 总耗时 %.0f ms' % ((time.time() - t0) * 1000))
    print('后端信息: %s' % fast.backend_info())

    # --- 单张 ---
    for tag, kw in (('普通', {}), ('带 Grad-CAM', {'enable_gradcam': True})):
        data = make_leaf_jpeg(seed=1)
        try:
            t0 = time.time()
            r = fast.predict(data, top_k=3, **kw)
            wall = (time.time() - t0) * 1000
            print('\n[%s] %d 字节 JPEG  墙上 %.1f ms  内部计 %.1f ms' % (tag, len(data), wall, r['inference_time_ms']))
            for p in r['predictions']:
                print('   #%d %-22s %6.2f%%  (%s)' % (p['rank'], p['disease_cn'], p['confidence'], p['disease_en']))
            print('   is_healthy=%s  severity=%s %.1f%%  gradcam=%s'
                  % (r['is_healthy'], r['severity'], r['severity_percent'],
                     '有' if r['grad_cam_base64'] else '无'))
            print('   建议: %s' % r['advices'])
        except Exception as e:
            print('\n[%s] 失败: %r' % (tag, e))

    # --- 重复调用，验证缓存生效（第二次应明显更快，且无每请求重建）---
    data = make_leaf_jpeg(seed=2)
    ts = []
    for _ in range(10):
        t0 = time.time()
        fast.predict(data, top_k=1)
        ts.append((time.time() - t0) * 1000)
    print('\n连续 10 次：min %.1f / median %.1f / max %.1f ms'
          % (min(ts), sorted(ts)[len(ts) // 2], max(ts)))

    # --- 与原版对比（需要 torch）---
    try:
        import torch  # noqa: F401
        from server.services import predict_service as orig
        orig.load_model()
        data = make_leaf_jpeg(seed=3)
        a = orig.predict(data, top_k=3, enable_gradcam=False)
        b = fast.predict(data, top_k=3, enable_gradcam=False)
        print('\n[一致性] 原版 top1 = %s (%.2f%%)  |  新版 top1 = %s (%.2f%%)  -> %s'
              % (a['predictions'][0]['disease_cn'], a['predictions'][0]['confidence'],
                 b['predictions'][0]['disease_cn'], b['predictions'][0]['confidence'],
                 '一致' if a['predictions'][0]['disease_cn'] == b['predictions'][0]['disease_cn'] else '不一致'))
        print('[耗时] 原版 %.2f ms  |  新版 %.2f ms'
              % (a['inference_time_ms'], b['inference_time_ms']))
    except Exception as e:
        print('\n[跳过与原版对比] %s: %r' % (type(e).__name__, e))

    print('=' * 62)


if __name__ == '__main__':
    main()
