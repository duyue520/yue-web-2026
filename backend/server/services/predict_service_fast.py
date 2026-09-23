"""
推理服务（优化版）—— 与 predict_service.py 接口完全一致，可直接替换。

开关方式（二选一）：
  A) 改 server/services/__init__.py:
        from .predict_service_fast import predict, load_model
  B) 或改 server/routers/predict.py 里的 import

相比原版的 7 处改动：
  1. 类名列表 / 预处理变换 / 建议表 全部模块级缓存 —— 原版每次请求都重建
  2. ONNX Runtime 为**主路径**，后端可用环境变量 PREDICT_BACKEND 选择（见下）
  3. 预处理改用 NumPy，不再经过 torch.Tensor —— ONNX 路径**完全不需要 torch**
     （torch 只在 Grad-CAM 时才 import，可整包从镜像里拿掉）
  4. onnxruntime SessionOptions 调优：intra_op 线程数按 CPU 核数、开全部图优化
  5. 启动时**预热**一次，抹掉首请求的冷启动延迟
  6. torch 兜底路径用 inference_mode() 而不是 no_grad()
  7. 记录预处理/推理/后处理分段耗时，便于继续定位

关于后端选择（实测依据，别凭直觉改）：
  在本机（24 逻辑核 + GPU）上隔离进程实测单张 224x224 前向：
      torch-fp32  665 MB RSS / ~69 ms
      onnx-fp32   146 MB RSS / ~57 ms     <- 默认
      onnx-int8    86 MB RSS / ~221 ms
  INT8 **明显更慢**（约 3.9x）。原因：该 CPU 缺 VNNI，int8 GEMM 退化为整数模拟，
  且动态量化要对激活值实时量化，batch=1 的卷积网络摊不平这份开销。
  所以**默认走 fp32**；若目标机器 CPU 支持 VNNI（Cascade Lake 及以后），
  可用 PREDICT_BACKEND=int8 再测一次，有可能反超。
  PREDICT_BACKEND 取值：onnx(默认) | int8 | torch | auto(auto=有 int8 就用 int8)
"""
import io
import os
import sys
import time
import base64
import threading

import numpy as np
from PIL import Image

from server.config import (
    MODEL_PATH, NUM_CLASSES, IMAGE_SIZE, MODEL_NAME,
    DISEASE_ADVICE, CLASS_CN, DATA_DIR,
)
from server.utils.severity import estimate_severity

Image.MAX_IMAGE_PIXELS = 16_000_000

_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32).reshape(1, 3, 1, 1)
_STD = np.array([0.229, 0.224, 0.225], dtype=np.float32).reshape(1, 3, 1, 1)

_lock = threading.Lock()
_ready = False
_backend = None            # 'onnx-int8' | 'onnx' | 'torch'
_onnx_session = None
_torch_model = None
_model = None              # 兼容旧探针：routers/predict.py 的 health_check 读 `_model is None`
_class_names = None
_resize = None
_last_timing = {}


# ---------------------------------------------------------------- 预处理
def _init_resize():
    """优先用 torchvision 的 Resize，保证与训练时的预处理完全一致；
    没有 torchvision 时退回 PIL，数值差异极小（分类结果基本不变）。"""
    global _resize
    if _resize is not None:
        return
    try:
        from torchvision.transforms import Resize as _TVResize
        _resize = _TVResize((IMAGE_SIZE, IMAGE_SIZE))
    except Exception:
        _resize = lambda im: im.resize((IMAGE_SIZE, IMAGE_SIZE), Image.BILINEAR)


def _preprocess(image_bytes: bytes):
    """返回 (NCHW float32 ndarray, 原始 PIL 图)，全 numpy，零 torch 依赖。"""
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = _resize(img)
    x = np.asarray(img, dtype=np.float32) / 255.0        # HWC
    x = x.transpose(2, 0, 1)[None, ...]                  # NCHW
    x = (x - _MEAN) / _STD
    return np.ascontiguousarray(x, dtype=np.float32), img


# ---------------------------------------------------------------- 类别名
def _load_class_names():
    """只做一次。原版每次 predict 都调用，且会 import data.dataset 并扫目录。"""
    global _class_names
    if _class_names is not None:
        return _class_names
    try:
        if os.path.exists(DATA_DIR):
            import importlib
            mod = importlib.import_module('data.dataset')
            ds = mod.LeafDataset(DATA_DIR, transform=None)
            _class_names = list(ds.classes)
            return _class_names
    except Exception:
        pass
    _class_names = list(CLASS_CN.keys())
    return _class_names


# ---------------------------------------------------------------- 模型
def _build_torch_model():
    import torch.nn as nn
    import torchvision.models as vm
    if MODEL_NAME == 'resnet18':
        m = vm.resnet18(weights=None)
        m.fc = nn.Linear(m.fc.in_features, NUM_CLASSES)
    elif MODEL_NAME == 'resnet34':
        m = vm.resnet34(weights=None)
        m.fc = nn.Linear(m.fc.in_features, NUM_CLASSES)
    elif MODEL_NAME == 'resnet50':
        m = vm.resnet50(weights=None)
        m.fc = nn.Linear(m.fc.in_features, NUM_CLASSES)
    elif MODEL_NAME == 'efficientnet_b0':
        m = vm.efficientnet_b0(weights=None)
        m.classifier[-1] = nn.Linear(m.classifier[-1].in_features, NUM_CLASSES)
    else:
        raise ValueError('不支持的模型: %s' % MODEL_NAME)
    return m


def _make_session(path):
    import onnxruntime as ort
    so = ort.SessionOptions()
    so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
    n = os.cpu_count() or 2
    so.intra_op_num_threads = max(1, min(2, n))     # 2 核机器上给 2
    so.inter_op_num_threads = 1
    try:
        so.enable_mem_pattern = True
        so.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL
    except Exception:
        pass
    return ort.InferenceSession(path, so, providers=['CPUExecutionProvider'])


def load_model():
    """启动时调用。与原版签名一致，返回 (model, device) 便于兼容旧调用。"""
    global _ready, _backend, _onnx_session, _torch_model, _model
    with _lock:
        if _ready:
            return _torch_model, 'cpu' if _torch_model is not None else None

        _init_resize()
        _load_class_names()

        base = MODEL_PATH.replace('.pth', '')
        # 后端选择：默认 onnx(fp32)。实测 int8 在本机反而慢 3.9x，故不作为默认。
        pref = (os.environ.get('PREDICT_BACKEND') or 'onnx').strip().lower()
        if pref in ('int8', 'auto'):
            order = (('onnx-int8', base + '.int8.onnx'), ('onnx', base + '.onnx'))
        elif pref == 'torch':
            order = ()
        else:  # 'onnx' 及未知取值
            order = (('onnx', base + '.onnx'),)
        print(' [i] PREDICT_BACKEND=%s -> 候选 %s' % (pref, [t for t, _ in order] or ['torch']))

        for tag, cand in order:
            if os.path.exists(cand):
                try:
                    t0 = time.time()
                    _onnx_session = _make_session(cand)
                    _backend = tag
                    print(' [OK] 推理后端 = %s (%s, 加载 %.2fs)'
                          % (tag, os.path.basename(cand), time.time() - t0))
                    break
                except Exception as e:
                    print(' [警告] %s 加载失败: %r' % (cand, e))

        if _onnx_session is None:
            import torch
            torch.set_num_threads(max(1, min(2, os.cpu_count() or 2)))
            _torch_model = _build_torch_model()
            state = torch.load(MODEL_PATH, map_location='cpu', weights_only=True)
            if isinstance(state, dict) and 'model_state_dict' in state:
                state = state['model_state_dict']
            _torch_model.load_state_dict(state)
            _torch_model.eval()
            _backend = 'torch'
            print(' [OK] 推理后端 = torch (CPU)')

        # 预热：跑两次，让 ONNX/线程池完成惰性初始化
        dummy = np.zeros((1, 3, IMAGE_SIZE, IMAGE_SIZE), dtype=np.float32)
        t0 = time.time()
        for _ in range(2):
            _infer(dummy)
        print(' [OK] 预热完成 %.1f ms/次 -> 后端 %s' % ((time.time() - t0) / 2 * 1000, _backend))

        _ready = True
        # 兼容旧探针：health_check 只判断 `_model is None`
        _model = _onnx_session if _onnx_session is not None else _torch_model
        return _torch_model, (_backend if _torch_model is not None else None)


def _infer(x: np.ndarray) -> np.ndarray:
    """执行一次前向，返回 logits (1, NUM_CLASSES)。"""
    global _last_timing
    t0 = time.time()
    if _onnx_session is not None:
        out = _onnx_session.run(None, {'input': x})[0]
    else:
        import torch
        with torch.inference_mode():
            out = _torch_model(torch.from_numpy(x)).numpy()
    _last_timing['infer'] = (time.time() - t0) * 1000
    return out


def _softmax(z: np.ndarray) -> np.ndarray:
    z = z - z.max(axis=1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=1, keepdims=True)


# ---------------------------------------------------------------- 主入口
def predict(image_bytes: bytes, top_k: int = 3, enable_gradcam: bool = False) -> dict:
    if not _ready:
        load_model()

    class_names = _load_class_names()
    cn_map = CLASS_CN

    t_start = time.time()
    x, original_img = _preprocess(image_bytes)
    t_pre = (time.time() - t_start) * 1000
    _last_timing['pre'] = t_pre

    # 计时口径与原版保持一致：只算「前向 + softmax + topk」，不含图像解码/预处理。
    # （原版 predict_service.py 的 start 也取在 transform 之后。否则两者数字不可比。）
    t_inf = time.time()
    logits = _infer(x)
    probs = _softmax(logits)

    k = max(1, min(int(top_k), probs.shape[1]))
    idx = np.argsort(-probs[0])[:k]
    top_probs = probs[0][idx]

    inference_time = (time.time() - t_inf) * 1000

    predictions = []
    for i, ci in enumerate(idx):
        ci = int(ci)
        name = str(class_names[ci]) if ci < len(class_names) else 'class_%d' % ci
        predictions.append({
            'rank': i + 1,
            'disease_cn': cn_map.get(name, name),
            'disease_en': name,
            'confidence': round(float(top_probs[i]) * 100, 2),
        })

    top1_name = str(class_names[int(idx[0])]) if int(idx[0]) < len(class_names) else ''
    is_healthy = 'healthy' in top1_name.lower()

    severity, severity_pct = estimate_severity(original_img, is_healthy)

    top1_cn = cn_map.get(top1_name, top1_name)
    advices = DISEASE_ADVICE.get(
        top1_cn,
        {'pesticide': '请咨询当地农技站', 'method': '建议联系农业专家进一步确认'},
    )

    grad_cam_b64 = None
    if enable_gradcam:
        try:
            import torch
            from server.utils.grad_cam import generate_gradcam
            if _torch_model is None:
                # ONNX 后端没有 torch 图，Grad-CAM 需要单独加载一份 torch 模型
                torch.set_num_threads(max(1, min(2, os.cpu_count() or 2)))
                m = _build_torch_model()
                st = torch.load(MODEL_PATH, map_location='cpu', weights_only=True)
                if isinstance(st, dict) and 'model_state_dict' in st:
                    st = st['model_state_dict']
                m.load_state_dict(st)
                m.eval()
                grad_cam_b64 = generate_gradcam(m, torch.from_numpy(x), original_img, target_layer='layer4')
            else:
                grad_cam_b64 = generate_gradcam(_torch_model, torch.from_numpy(x), original_img, target_layer='layer4')
        except Exception as e:
            print(' [警告] Grad-CAM 生成失败: %r' % (e,))

    return {
        'predictions': predictions,
        'is_healthy': is_healthy,
        'severity': severity,
        'severity_percent': severity_pct,
        'advices': advices,
        'grad_cam_base64': grad_cam_b64,
        'inference_time_ms': round(inference_time, 2),
    }


def backend_info() -> dict:
    return {
        'backend': _backend,
        'ready': _ready,
        'timing_ms': dict(_last_timing),
        'class_names_cached': _class_names is not None and len(_class_names or []) or 0,
    }
