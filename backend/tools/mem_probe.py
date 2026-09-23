"""测量各推理后端的进程内存占用（Windows PeakWorkingSetSize / WorkingSetSize）。

用法：
    python tools/mem_probe.py torch
    python tools/mem_probe.py onnx
    python tools/mem_probe.py int8

每个后端单独起进程测，避免互相污染。
"""
import ctypes
import ctypes.wintypes as wt
import os
import sys
import time

import numpy as np

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, PROJECT_DIR)

MODEL_PATH = os.path.join(PROJECT_DIR, 'weights', 'best_model.pth')
ONNX_PATH = MODEL_PATH.replace('.pth', '.onnx')
INT8_PATH = MODEL_PATH.replace('.pth', '.int8.onnx')
IMAGE_SIZE = 224


class PROCESS_MEMORY_COUNTERS(ctypes.Structure):
    _fields_ = [
        ("cb", wt.DWORD), ("PageFaultCount", wt.DWORD),
        ("PeakWorkingSetSize", ctypes.c_size_t), ("WorkingSetSize", ctypes.c_size_t),
        ("QuotaPeakPagedPoolUsage", ctypes.c_size_t), ("QuotaPagedPoolUsage", ctypes.c_size_t),
        ("QuotaPeakNonPagedPoolUsage", ctypes.c_size_t), ("QuotaNonPagedPoolUsage", ctypes.c_size_t),
        ("PagefileUsage", ctypes.c_size_t), ("PeakPagefileUsage", ctypes.c_size_t),
    ]


def mem():
    c = PROCESS_MEMORY_COUNTERS()
    c.cb = ctypes.sizeof(c)
    ctypes.windll.psapi.GetProcessMemoryInfo(
        ctypes.windll.kernel32.GetCurrentProcess(), ctypes.byref(c), c.cb)
    return c.WorkingSetSize / 1048576, c.PeakWorkingSetSize / 1048576


def show(tag):
    cur, peak = mem()
    print('  %-28s 当前 %7.1f MB   峰值 %7.1f MB' % (tag, cur, peak))
    return cur


def main():
    mode = (sys.argv[1] if len(sys.argv) > 1 else 'onnx').lower()
    print('=' * 66)
    print('后端: %s   python: %s' % (mode, sys.executable))
    print('=' * 66)
    show('① 解释器仅 import numpy')

    x = np.zeros((1, 3, IMAGE_SIZE, IMAGE_SIZE), dtype=np.float32)

    if mode == 'torch':
        import torch
        import torch.nn as nn
        import torchvision.models as vm
        show('② import torch+torchvision')
        torch.set_num_threads(2)
        m = vm.resnet18(weights=None)
        m.fc = nn.Linear(m.fc.in_features, 39)
        st = torch.load(MODEL_PATH, map_location='cpu', weights_only=True)
        if isinstance(st, dict) and 'model_state_dict' in st:
            st = st['model_state_dict']
        m.load_state_dict(st)
        m.eval()
        show('③ 加载 .pth 权重后')

        def run():
            with torch.inference_mode():
                m(torch.from_numpy(x))
    else:
        import onnxruntime as ort
        show('② import onnxruntime')
        path = INT8_PATH if mode == 'int8' else ONNX_PATH
        so = ort.SessionOptions()
        so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        so.intra_op_num_threads = 2
        so.inter_op_num_threads = 1
        sess = ort.InferenceSession(path, so, providers=['CPUExecutionProvider'])
        show('③ 加载 %s 后' % os.path.basename(path))
        name = sess.get_inputs()[0].name

        def run():
            sess.run(None, {name: x})

    run()
    show('④ 首次推理后')
    t0 = time.time()
    for _ in range(20):
        run()
    show('⑤ 再推理 20 次后')
    print('  20 次推理耗时 %.1f ms' % ((time.time() - t0) * 1000))
    cur, peak = mem()
    print('\n结论: 进程峰值内存 %.1f MB' % peak)
    # 便于脚本汇总
    print('RESULT,%s,%.1f,%.1f' % (mode, cur, peak))


if __name__ == '__main__':
    main()
