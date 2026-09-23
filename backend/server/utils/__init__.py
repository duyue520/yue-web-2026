# Grad-CAM 依赖 torch/torchvision，运行时镜像里并不安装（推理走 ONNX Runtime）。
# 这里必须"可选导入"，否则 Alembic / uvicorn / 任何 import server.* 的动作都会
# 在 ImportError: No module named 'torch' 处直接崩掉（踩过一次）。
try:
    from .grad_cam import generate_gradcam          # noqa: F401
except Exception:  # torch / cv2 缺失时降级：热力图功能关闭，其余照常
    generate_gradcam = None

from .severity import estimate_severity             # noqa: F401
