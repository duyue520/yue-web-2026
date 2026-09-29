"""
多作物叶片病害智能诊断系统 — FastAPI 后端服务

启动方式:
    python -m server.main
    # 或
    cd server && python main.py
    # 或
    uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload

API 文档:
    http://localhost:8000/docs  (Swagger UI)
    http://localhost:8000/redoc (ReDoc)
"""
import sys
import os

# 添加项目根目录
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .database import init_db
from .routers import auth, predict, feedback, export as export_router, guestbook, blog, music, ai, airelay, video
from .config import CORS_ORIGINS


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期"""
    init_db()
    print(" [OK] 数据库初始化完成")
    # Fail startup when model is missing or incompatible.
    from .services.predict_service_fast import load_model
    load_model()
    print(" [OK] Database and model ready")
    yield

# 创建 FastAPI 应用
app = FastAPI(
    lifespan=lifespan,
    title="多作物叶片病害智能诊断系统 API",
    description="""
## 🌿 功能概览

- **病害诊断**: 上传叶片照片，AI 自动识别 39 种病害/健康状态
- **Grad-CAM 热力图**: 可视化展示模型关注的叶片区域
- **严重度评估**: 自动估算病斑面积占比（轻度/中度/重度）
- **防治建议**: 每种病害附带农药方案和农艺措施
- **批量诊断**: 一次上传多张照片，支持导出 Excel
- **用户系统**: 注册登录、诊断历史、反馈纠错
- **留言反馈**: 提交 Bug、建议，管理员可回复

## 🔧 技术栈

- **框架**: FastAPI (高性能异步 Python Web 框架)
- **模型**: ResNet18 (PyTorch) — 39 类，验证准确率 99.4%
- **认证**: JWT Bearer Token
- **数据库**: PostgreSQL (SQLAlchemy ORM)
    """,
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

from .limits import LimitsMiddleware
app.add_middleware(LimitsMiddleware)

# CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 全局异常处理 —— 确保所有错误返回 JSON 而非 HTML
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """捕获所有未处理异常，返回 JSON 格式错误"""
    # Do not expose exception strings, SQL parameters, or credentials.
    import logging
    logging.getLogger(__name__).error("Unhandled error type=%s", type(exc).__name__)
    msg = '服务器内部错误，请稍后重试'
    return JSONResponse(
        status_code=500,
        content={"detail": msg},
    )

# 同样处理 HTTPException，保证 JSON 格式一致 + 透传 headers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=getattr(exc, 'headers', None) or {},
    )

# 注册路由
app.include_router(auth.router)
app.include_router(predict.router)
app.include_router(feedback.router)
app.include_router(export_router.router)
app.include_router(guestbook.router)
app.include_router(blog.router)
app.include_router(music.router)
app.include_router(ai.router)
app.include_router(airelay.router)
app.include_router(video.router)


@app.get("/")
def root():
    """根路由 —— API 信息"""
    return {
        "name": "多作物叶片病害智能诊断系统 API",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/api/health",
        "endpoints": {
            "auth": ["/api/auth/register", "/api/auth/login", "/api/auth/me"],
            "diagnosis": ["/api/predict", "/api/predict/batch"],
            "feedback": ["/api/feedback", "/api/feedback/my"],
            "export": ["/api/export/excel"],
            "correction": ["/api/correct"],
        },
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server.main:app", host="0.0.0.0", port=int(os.environ.get("PORT", "7860")), reload=False)
