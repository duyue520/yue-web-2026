#!/usr/bin/env python
"""
推理后端对比基准：torch-fp32  vs  onnx-fp32  vs  onnx-int8

度量：
  - 单张 224x224 前向延迟（warmup + 多轮，报 mean/median/p95）
  - 模型文件体积
  - top1 一致率（以 torch-fp32 为基准）
  - 不同 intra_op 线程数下的延迟（模拟 1/2/4 vCPU 的服务器）

用法：
    python tools/benchmark_inference.py
    python tools/benchmark_inference.py --runs 50 --threads 1,2,4
    python tools/benchmark_inference.py --images /path/to/dir   # 用真实图片测一致率

注意：本机核数通常多于目标服务器（2 vCPU）。绝对值不可直接搬到服务器，
     但**后端之间的相对快慢**与**线程数趋势**是可迁移的。
"""
import argparse
import os
import statistics
import sys
import time

import numpy as np

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, PROJECT_DIR)

try:
    from server.config import MODEL_PATH, NUM_CLASSES, IMAGE_SIZE, MODEL_NAME  # noqa: E402
    _CFG_SOURCE = 'server.config'
except Exception as _e:
    MODEL_PATH = os.path.join(PROJECT_DIR, 'weights', 'best_model.pth')
    NUM_CLASSES = 39
    IMAGE_SIZE = 224
    MODEL_NAME = 'resnet18'
    _CFG_SOURCE = 'builtin-defaults (%s)' % type(_e).__name__

ONNX_PATH = MODEL_PATH.replace('.pth', '.onnx')
INT8_PATH = MODEL_PATH.replace('.pth', '.int8.onnx')

_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32).reshape(1, 3, 1, 1)
_STD = np.array([0.229, 0.224, 0.225], dtype=np.float32).reshape(1, 3, 1, 1)


def build_model(model_name, num_classes):
    import torch.nn as nn
    import torchvision.models as vm
    if model_name == 'resnet18':
        m = vm.resnet18(weights=None); m.fc = nn.Linear(m.fc.in_features, num_classes)
    elif model_name == 'resnet34':
        m = vm.resnet34(weights=None); m.fc = nn.Linear(m.fc.in_features, num_classes)
    elif model_name == 'resnet50':
        m = vm.resnet50(weights=None); m.fc = nn.Linear(m.fc.in_features, num_classes)
    elif model_name == 'efficientnet_b0':
        m = vm.efficientnet_b0(weights=None)
        m.classifier[-1] = nn.Linear(m.classifier[-1].in_features, num_classes)
    else:
        raise ValueError('不支持的模型: %s' % model_name)
    return m


def load_torch():
    import torch
    m = build_model(MODEL_NAME, NUM_CLASSES)
    st = torch.load(MODEL_PATH, map_location='cpu', weights_only=True)
    if isinstance(st, dict) and 'model_state_dict' in st:
        st = st['model_state_dict']
    m.load_state_dict(st)
    m.eval()
    return m


def make_session(path, threads):
    import onnxruntime as ort
    so = ort.SessionOptions()
    so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
    so.intra_op_num_threads = threads
    so.inter_op_num_threads = 1
    return ort.InferenceSession(path, so, providers=['CPUExecutionProvider'])


def stats(ts):
    s = sorted(ts)
    return {
        'mean': statistics.mean(ts),
        'median': statistics.median(ts),
        'p95': s[min(len(s) - 1, int(round(len(s) * 0.95)) - 1)],
        'min': min(ts),
    }


def bench(fn, x, warmup=5, runs=30):
    for _ in range(warmup):
        fn(x)
    ts = []
    for _ in range(runs):
        t0 = time.perf_counter()
        fn(x)
        ts.append((time.perf_counter() - t0) * 1000.0)
    return stats(ts)


def load_inputs(images_dir, n=24):
    """返回 (inputs NCHW, 来源说明)。没有真实图片就用合成噪声+色块。"""
    out = []
    if images_dir and os.path.isdir(images_dir):
        from PIL import Image
        files = [f for f in sorted(os.listdir(images_dir))
                 if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.bmp'))]
        for f in files[:n]:
            img = Image.open(os.path.join(images_dir, f)).convert('RGB')
            img = img.resize((IMAGE_SIZE, IMAGE_SIZE), Image.BILINEAR)
            a = np.asarray(img, dtype=np.float32) / 255.0
            out.append(a.transpose(2, 0, 1)[None, ...])
        if out:
            return np.ascontiguousarray(np.concatenate(out, 0), dtype=np.float32), \
                '真实图片 %d 张 (%s)' % (len(out), images_dir)
    rng = np.random.default_rng(20260918)
    for i in range(n):
        # 混合：纯噪声 / 主色调块 / 带纹理的绿(模拟叶片)
        # 注意 rng.normal 默认 float64，必须显式转 float32，否则拼接后会被提升成 double，
        # torch 侧会报 expected scalar type Double but found Float
        if i % 3 == 0:
            a = rng.random((IMAGE_SIZE, IMAGE_SIZE, 3), dtype=np.float32)
        elif i % 3 == 1:
            base = rng.random((3,), dtype=np.float32)
            a = np.tile(base, (IMAGE_SIZE, IMAGE_SIZE, 1)) + rng.normal(0, .05, (IMAGE_SIZE, IMAGE_SIZE, 3)).astype(np.float32)
            a = np.clip(a, 0, 1)
        else:
            g = np.array([0.25, 0.55, 0.2], dtype=np.float32)
            a = np.tile(g, (IMAGE_SIZE, IMAGE_SIZE, 1)) + rng.normal(0, .09, (IMAGE_SIZE, IMAGE_SIZE, 3)).astype(np.float32)
            a = np.clip(a, 0, 1)
        out.append(np.asarray(a, dtype=np.float32).transpose(2, 0, 1)[None, ...])
    return np.ascontiguousarray(np.concatenate(out, 0), dtype=np.float32), \
        '合成输入 %d 张（无真实图片目录）' % n


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--runs', type=int, default=30)
    ap.add_argument('--warmup', type=int, default=5)
    ap.add_argument('--threads', default='1,2,4')
    ap.add_argument('--images', default=None)
    args = ap.parse_args()

    print('=' * 68)
    print('配置来源: %s' % _CFG_SOURCE)
    print('模型: %s  类别 %d  输入 %dx%d' % (MODEL_NAME, NUM_CLASSES, IMAGE_SIZE, IMAGE_SIZE))
    print('CPU 逻辑核数: %s   （目标服务器仅 2 vCPU，注意区分）' % (os.cpu_count(),))
    for p in (MODEL_PATH, ONNX_PATH, INT8_PATH):
        print('  %-40s %s' % (os.path.basename(p),
                              ('%.2f MB' % (os.path.getsize(p) / 1048576)) if os.path.exists(p) else '<不存在>'))
    print('=' * 68)

    inputs, src = load_inputs(args.images)
    print('基准输入: %s' % src)
    x0 = inputs[:1]
    x_all = inputs

    torch_logits = None
    results = {}

    # ---------------- torch fp32 ----------------
    if os.path.exists(MODEL_PATH):
        import torch
        t0 = time.time()
        m = load_torch()
        print('\n[torch-fp32] 加载耗时 %.2fs' % (time.time() - t0))
        for th in [int(t) for t in args.threads.split(',')]:
            torch.set_num_threads(th)
            def f(x, m=m, th=th):
                with torch.inference_mode():
                    return m(torch.from_numpy(x)).numpy()
            f(x0)
            st = bench(f, x0, args.warmup, args.runs)
            results['torch-fp32/t%d' % th] = st
            print('  threads=%d  mean %7.2f ms  median %7.2f  p95 %7.2f' % (th, st['mean'], st['median'], st['p95']))
        with torch.inference_mode():
            torch_logits = np.concatenate([m(torch.from_numpy(x_all[i:i + 1])).numpy()
                                           for i in range(len(x_all))], 0)
        torch.set_num_threads(min(2, os.cpu_count() or 2))

    # ---------------- onnx fp32 / int8 ----------------
    for tag, path in (('onnx-fp32', ONNX_PATH), ('onnx-int8', INT8_PATH)):
        if not os.path.exists(path):
            print('\n[%s] 跳过：%s 不存在' % (tag, os.path.basename(path)))
            continue
        for th in [int(t) for t in args.threads.split(',')]:
            sess = make_session(path, th)
            input_name = sess.get_inputs()[0].name
            def f(x, sess=sess, input_name=input_name):
                return sess.run(None, {input_name: x})[0]
            f(x0)
            st = bench(f, x0, args.warmup, args.runs)
            results['%s/t%d' % (tag, th)] = st
            print('\n[%s] threads=%d' % (tag, th))
            print('  mean %7.2f ms  median %7.2f  p95 %7.2f' % (st['mean'], st['median'], st['p95']))
            if torch_logits is not None and th == int(args.threads.split(',')[0]):
                logits = np.concatenate([sess.run(None, {input_name: x_all[i:i + 1]})[0]
                                         for i in range(len(x_all))], 0)
                maxdiff = float(np.abs(logits - torch_logits).max())
                agree = int((logits.argmax(1) == torch_logits.argmax(1)).sum())
                print('  vs torch: 最大绝对差 %.3e   top1 一致 %d/%d' % (maxdiff, agree, len(x_all)))

    # ---------------- 汇总 ----------------
    print('\n' + '=' * 68)
    print('汇总（单张 224x224 前向, median ms）')
    base = None
    for k, v in results.items():
        if k.startswith('torch-fp32/t'):
            base = v['median']
            break
    for k, v in results.items():
        speed = ('%.2fx' % (base / v['median'])) if base else '-'
        print('  %-18s median %7.2f ms   p95 %7.2f ms   相对 torch 加速 %s' % (k, v['median'], v['p95'], speed))
    print('=' * 68)


if __name__ == '__main__':
    main()
