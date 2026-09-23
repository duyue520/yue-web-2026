"""被监控的子进程：只负责加载某个后端并推理，用 MARK 行报告阶段。"""
import os
import sys
import time

import numpy as np

mode = sys.argv[1]
PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, PROJECT_DIR)
W = os.path.join(PROJECT_DIR, 'weights')
PTH = os.path.join(W, 'best_model.pth')
ONNX = os.path.join(W, 'best_model.onnx')
INT8 = os.path.join(W, 'best_model.int8.onnx')
S = 224


def mark(s):
    print('MARK ' + s, flush=True)
    time.sleep(0.7)      # 留时间给外部监控采样


x = np.zeros((1, 3, S, S), dtype=np.float32)
mark('numpy-only')

if mode == 'torch':
    import torch
    import torch.nn as nn
    import torchvision.models as vm
    mark('import-torch')
    torch.set_num_threads(2)
    m = vm.resnet18(weights=None)
    m.fc = nn.Linear(m.fc.in_features, 39)
    st = torch.load(PTH, map_location='cpu', weights_only=True)
    if isinstance(st, dict) and 'model_state_dict' in st:
        st = st['model_state_dict']
    m.load_state_dict(st)
    m.eval()
    mark('weights-loaded')

    def run():
        with torch.inference_mode():
            m(torch.from_numpy(x))
else:
    import onnxruntime as ort
    mark('import-onnxruntime')
    so = ort.SessionOptions()
    so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
    so.intra_op_num_threads = 2
    so.inter_op_num_threads = 1
    sess = ort.InferenceSession(INT8 if mode == 'int8' else ONNX, so,
                                providers=['CPUExecutionProvider'])
    mark('session-created')
    name = sess.get_inputs()[0].name

    def run():
        sess.run(None, {name: x})


run()
mark('first-infer')
import statistics as _st
for _ in range(3):
    run()
ts = []
for _ in range(30):
    t0 = time.perf_counter()
    run()
    ts.append((time.perf_counter() - t0) * 1000)
print('TIME %s median=%.2f min=%.2f ms' % (mode, _st.median(ts), min(ts)), flush=True)
mark('after-30-infer')
mark('END')
