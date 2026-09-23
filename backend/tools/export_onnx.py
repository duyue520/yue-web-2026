#!/usr/bin/env python
"""
把 weights/best_model.pth 导出为 ONNX，可选做 INT8 动态量化。

用法（在 deployment-backend 目录下）：
    python tools/export_onnx.py                    # 导出 fp32 ONNX
    python tools/export_onnx.py --quantize         # 额外产出 INT8 动态量化版
    python tools/export_onnx.py --verify           # 与 PyTorch 输出逐项比对

产出：
    weights/best_model.onnx          fp32，供 onnxruntime 推理
    weights/best_model.int8.onnx     可选，INT8 量化版（体积约 1/4，CPU 更快）
"""
import argparse
import os
import sys
import time

import numpy as np
import torch
import torch.nn as nn

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, PROJECT_DIR)

# 导出是**离线构建步骤**，不连库、不需要密钥。
# 但 server.config 是 fail-closed 的（缺 DATABASE_URL/SECRET_KEY 直接 raise），
# 且它自己 import SQLAlchemy。所以这里做兜底：拿不到就用与 config.py 相同的默认值，
# 保证本工具只依赖 torch/torchvision/onnx 就能跑。
try:
    from server.config import MODEL_PATH, NUM_CLASSES, IMAGE_SIZE, MODEL_NAME  # noqa: E402
    _CFG_SOURCE = 'server.config'
except Exception as _e:  # RuntimeError（缺环境变量）/ ImportError（缺 SQLAlchemy）都会走到这里
    MODEL_PATH = os.path.join(PROJECT_DIR, 'weights', 'best_model.pth')
    NUM_CLASSES = 39
    IMAGE_SIZE = 224
    MODEL_NAME = 'resnet18'
    _CFG_SOURCE = 'builtin-defaults (%s)' % type(_e).__name__


def build_model(model_name: str, num_classes: int) -> nn.Module:
    import torchvision.models as vm
    if model_name == 'resnet18':
        m = vm.resnet18(weights=None)
        m.fc = nn.Linear(m.fc.in_features, num_classes)
    elif model_name == 'resnet34':
        m = vm.resnet34(weights=None)
        m.fc = nn.Linear(m.fc.in_features, num_classes)
    elif model_name == 'resnet50':
        m = vm.resnet50(weights=None)
        m.fc = nn.Linear(m.fc.in_features, num_classes)
    elif model_name == 'efficientnet_b0':
        m = vm.efficientnet_b0(weights=None)
        m.classifier[-1] = nn.Linear(m.classifier[-1].in_features, num_classes)
    else:
        raise ValueError('不支持的模型: %s' % model_name)
    return m


def load_torch_model():
    model = build_model(MODEL_NAME, NUM_CLASSES)
    state = torch.load(MODEL_PATH, map_location='cpu', weights_only=True)
    if isinstance(state, dict) and 'model_state_dict' in state:
        state = state['model_state_dict']
    model.load_state_dict(state)
    model.eval()
    return model


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--quantize', action='store_true', help='额外产出 INT8 动态量化模型')
    ap.add_argument('--verify', action='store_true', help='与 PyTorch 输出比对')
    ap.add_argument('--opset', type=int, default=17)
    args = ap.parse_args()

    onnx_path = MODEL_PATH.replace('.pth', '.onnx')
    int8_path = MODEL_PATH.replace('.pth', '.int8.onnx')

    print('配置来源: %s' % _CFG_SOURCE)
    print('加载 PyTorch 权重: %s' % MODEL_PATH)
    if not os.path.exists(MODEL_PATH):
        raise SystemExit('找不到权重文件: %s' % MODEL_PATH)
    model = load_torch_model()
    n_param = sum(p.numel() for p in model.parameters())
    print('  模型 %s, 参数 %.2f M, 类别 %d, 输入 %dx%d'
          % (MODEL_NAME, n_param / 1e6, NUM_CLASSES, IMAGE_SIZE, IMAGE_SIZE))

    dummy = torch.randn(1, 3, IMAGE_SIZE, IMAGE_SIZE)

    print('\n导出 ONNX (opset %d) ...' % args.opset)
    t0 = time.time()
    torch.onnx.export(
        model, dummy, onnx_path,
        input_names=['input'], output_names=['logits'],
        dynamic_axes={'input': {0: 'batch'}, 'logits': {0: 'batch'}},
        opset_version=args.opset,
        do_constant_folding=True,
        dynamo=False,
    )
    print('  完成 %.1fs -> %s (%.1f MB)'
          % (time.time() - t0, onnx_path, os.path.getsize(onnx_path) / 1048576))

    if args.quantize:
        print('\nINT8 动态量化 ...')
        # 坑：onnxruntime 的 quantize_dynamic 会先在**模型同目录**写一个中间文件
        # "<name>-inferred.onnx" 再读回。若该目录路径含非 ASCII 字符（例如中文目录），
        # 中间文件写入会失败，表现为 FileNotFoundError: '...-inferred.onnx'。
        # 解法：把 fp32 模型复制到纯 ASCII 的临时目录里量化，完成后再拷回目标路径。
        import shutil
        import tempfile
        try:
            from onnxruntime.quantization import quantize_dynamic, QuantType
            t0 = time.time()
            tmpdir = tempfile.mkdtemp(prefix='wbquant_')
            try:
                ascii_src = os.path.join(tmpdir, 'model.onnx')
                ascii_out = os.path.join(tmpdir, 'model.int8.onnx')
                shutil.copyfile(onnx_path, ascii_src)
                quantize_dynamic(ascii_src, ascii_out, weight_type=QuantType.QInt8)
                shutil.copyfile(ascii_out, int8_path)
            finally:
                shutil.rmtree(tmpdir, ignore_errors=True)
            src_mb = os.path.getsize(onnx_path) / 1048576
            out_mb = os.path.getsize(int8_path) / 1048576
            print('  完成 %.1fs -> %s (%.1f MB, 原 %.1f MB, 压缩 %.1fx)'
                  % (time.time() - t0, int8_path, out_mb, src_mb, src_mb / max(out_mb, 1e-9)))
        except Exception as e:
            import traceback
            print('  量化失败: %r' % (e,))
            traceback.print_exc()

    if args.verify:
        print('\n数值校验（ONNX vs PyTorch）...')
        import onnxruntime as ort
        so = ort.SessionOptions()
        so.intra_op_num_threads = 2
        so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        sess = ort.InferenceSession(onnx_path, so, providers=['CPUExecutionProvider'])

        for i in range(3):
            x = torch.randn(1, 3, IMAGE_SIZE, IMAGE_SIZE)
            with torch.inference_mode():
                ref = model(x).numpy()
            got = sess.run(None, {'input': x.numpy()})[0]
            diff = np.abs(ref - got).max()
            same = int(ref.argmax()) == int(got.argmax())
            print('  样本%d 最大绝对差 %.3e, top1 一致=%s' % (i + 1, diff, same))

        if os.path.exists(int8_path):
            s8 = ort.InferenceSession(int8_path, so, providers=['CPUExecutionProvider'])
            agree = 0
            N = 20
            for _ in range(N):
                x = torch.randn(1, 3, IMAGE_SIZE, IMAGE_SIZE).numpy()
                a = int(sess.run(None, {'input': x})[0].argmax())
                b = int(s8.run(None, {'input': x})[0].argmax())
                agree += (a == b)
            print('  fp32 vs int8 top1 一致率: %d/%d' % (agree, N))

    print('\n完成。')


if __name__ == '__main__':
    main()
