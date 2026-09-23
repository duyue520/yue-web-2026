"""
公共留言板路由 —— 无需登录可发，登录后可删自己留言
"""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from ..database import Base, get_db, engine
from ..services.auth_service import get_current_user
from ..models.db_models import User

router = APIRouter(prefix="/api/guestbook", tags=["留言板"])


class GuestbookMessage(Base):
    __tablename__ = "guestbook_messages"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=True)
    owner_name = Column(String(50), nullable=True)  # 发帖用户名（user_id变了也能识别）
    nickname = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    deleted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# Schema is managed exclusively by migrations.


class MessageCreate(BaseModel):
    nickname: str = Field(..., min_length=1, max_length=50)
    content: str = Field(..., min_length=1, max_length=500)


@router.get("")
def list_messages(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """获取留言列表（所有人可见，不包含已删除）"""
    messages = db.query(GuestbookMessage)\
        .filter(GuestbookMessage.deleted == False)\
        .order_by(GuestbookMessage.created_at.desc())\
        .offset(skip).limit(limit).all()
    return {
        "total": db.query(GuestbookMessage).filter(GuestbookMessage.deleted == False).count(),
        "messages": [
            {
                "id": m.id,
                "user_id": m.user_id,
                "owner_name": m.owner_name,
                "nickname": m.nickname,
                "content": m.content,
                "created_at": m.created_at.strftime("%m-%d %H:%M"),
            }
            for m in messages
        ],
    }


@router.post("")
def create_message(
    data: MessageCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """发表留言（必须登录）"""

    msg = GuestbookMessage(
        user_id=user.id,
        owner_name=user.username,
        nickname="匿名",
        content=data.content,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return {
        "success": True,
        "message": "留言发表成功！",
        "data": {
            "id": msg.id,
            "user_id": msg.user_id,
            "owner_name": msg.owner_name,
            "nickname": msg.nickname,
            "content": msg.content,
            "created_at": msg.created_at.strftime("%m-%d %H:%M"),
        },
    }


@router.delete("/{message_id}")
def delete_message(
    message_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """删除留言（只能删除自己的）"""

    msg = db.query(GuestbookMessage).filter(GuestbookMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="留言不存在")
    # Immutable numeric ownership only; usernames can be renamed/re-registered.
    if msg.user_id != user.id:
        raise HTTPException(status_code=403, detail="只能删除自己的留言")

    msg.deleted = True
    db.commit()
    return {"success": True, "message": "留言已删除"}
