from .auth_service import hash_password, verify_password, create_access_token, get_current_user
# 优化版推理服务（ONNX Runtime 主路径，接口与原版完全一致）。
# 需要回退原实现时，只改这一行为 from .predict_service import predict, load_model 即可。
from .predict_service_fast import predict, load_model
