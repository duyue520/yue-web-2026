"""用**真实权重**分别测 torch / onnx-fp32 / onnx-int8 的单次前向耗时。
全程单进程顺序执行、带进度输出，避免缓冲与争抢导致误判。
"""
import os
import statistics
import sys
import time

import numpy as np

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, PROJECT_DIR)
W = os.path.join(PROJECT_DIR, 'weights')
PTH = os.path.join(W, 'best_model.pth')
ONNX = os.path.join(W, 'best_model.onnx')
INT8 = os.path.join(W, 'best_model.int8.onnx')
S = 224

print('cpu_count=%s  torch_threads_default=%s' % (os.cpu_count(), ''), flush=True)
x = np.ascontiguousarray(np.random.default_rng(7).random((1, 3, S, S)).astype(np.float32))


def timeit(fn, n=10, warm=3):
    for _ in range(warm):
        fn()
    ts = []
    for _ in range(n):
        t0 = time.perf_counter()
        fn()
        ts.append((time.perf_counter() - t0) * 1000)
    return statistics.median(ts), min(ts), max(ts)


results = {}

# ---------- torch ----------
import torch
import torch.nn as nn
import torchvision.models as vm
print('\n>>> torch', torch.__version__, 'cuda_avail=', torch.cuda.is_available(), flush=True)
print('    loading real weights ...', flush=True)
t0 = time.perf_counter()
m = vm.resnet18(weights=None)
m.fc = nn.Linear(m.fc.in_features, 39)
st = torch.load(PTH, map_location='cpu', weights_only=True)
if isinstance(st, dict) and 'model_state_dict' in st:
    st = st['model_state_dict']
m.load_state_dict(st)
m.eval()
print('    loaded %.2fs' % (time.perf_counter() - t0), flush=True)

for nth in (1, 2, 24):
    torch.set_num_threads(nth)
    med, lo, hi = timeit(lambda: m(torch.from_numpy(x)))
    results['torch-fp32/t%d' % nth] = med
    print('    torch threads=%-3d median %9.2f ms  (min %.2f max %.2f)' % (nth, med, lo, hi), flush=True)

# ---------- onnx ----------
import onnxruntime as ort
print('\n>>> onnxruntime', ort.__version__, flush=True)
for tag, path in (('onnx-fp32', ONNX), ('onnx-int8', INT8)):
    for nth in (1, 2, 24):
        so = ort.SessionOptions()
        so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        so.intra_op_num_threads = nth
        so.inter_op_num_threads = 1
        sess = ort.InferenceSession(path, so, providers=['CPUExecutionProvider'])
        name = sess.get_inputs()[0].name
        med, lo, hi = timeit(lambda: sess.run(None, {name: x}))
        results['%s/t%d' % (tag, nth)] = med
        print('    %-10s threads=%-3d median %9.2f ms  (min %.2f max %.2f)' % (tag, nth, med, lo, hi), flush=True)

print('\n' + '=' * 64)
base = results.get('torch-fp32/t2') or results.get('torch-fp32/t1')
for k, v in results.items():
    rel = ('%.2fx' % (base / v)) if base else '-'
    print('  %-18s %9.2f ms   相对 torch/t2 %s' % (k, v, rel))
print('=' * 64)
