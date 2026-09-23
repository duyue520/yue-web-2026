"""External PostgreSQL only. Never creates or migrates tables during import."""
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from .config import DATABASE_URL

engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_size=3,
                       max_overflow=2, pool_recycle=300,
                       connect_args={"connect_timeout": 15}, hide_parameters=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    with SessionLocal() as db:
        yield db

def init_db():
    """Check migration revision; fail instead of silently starting a new DB."""
    with engine.connect() as conn:
        revision = conn.execute(text("SELECT version_num FROM alembic_version")).scalar_one()
        if revision != "0001":
            raise RuntimeError("Database revision mismatch; run the reviewed migrations first")
