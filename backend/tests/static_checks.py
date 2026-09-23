"""No network or original database reads. Configuration + migration validation."""
import ast, os, sys, runpy, hashlib
from pathlib import Path
from unittest.mock import patch
root = Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root / '.test-deps'))
sys.path.insert(0,str(root))
files = [*root.glob('*.py'),*root.joinpath('server').rglob('*.py'),*root.joinpath('migrations').rglob('*.py'),*root.joinpath('tests').rglob('*.py')]
for path in files:
    ast.parse(path.read_text(encoding='utf-8-sig'), filename=str(path))
print('PASS syntax:',len(files))
base = {'DATABASE_URL':'postgresql://test:test@localhost/test?sslmode=require','SECRET_KEY':'synthetic-key-not-production-1234567890','CORS_ORIGINS':'https://frontend.example'}
for key,value in [('DATABASE_URL',''),('DATABASE_URL','sqlite:///app.db'),('DATABASE_URL','postgresql://test:test@localhost/test'),('SECRET_KEY',''),('SECRET_KEY','crop-disease-secret-key-change-in-production'),('CORS_ORIGINS','*')]:
    with patch.dict(os.environ,{**base,key:value},clear=True):
        try:
            runpy.run_path(str(root/'server/config.py'))
        except RuntimeError:
            pass
        else:
            raise AssertionError('Expected rejection: '+key)
print('PASS rejects missing DB, SQLite, non-TLS Postgres, missing/default secret, wildcard CORS')
os.environ.update(base)
from server.database import Base
from server.models import db_models
from server.routers import blog, guestbook
from sqlalchemy import create_engine
from alembic.migration import MigrationContext
from alembic.operations import Operations
from alembic.autogenerate import compare_metadata
engine = create_engine('sqlite://')
revision = runpy.run_path(str(root/'migrations/versions/0001_initial.py'))
with engine.begin() as connection:
    context = MigrationContext.configure(connection)
    with Operations.context(context):
        revision['upgrade']()
    diff = compare_metadata(context, Base.metadata)
    assert not diff, repr(diff)
print('PASS initial migration schema equals ORM (synthetic SQLite dialect; PostgreSQL SQL separately compiled)')
model=root/'weights/best_model.pth'
assert hashlib.sha256(model.read_bytes()).hexdigest() == 'e0b51e4c73cae7190986aaf8e6d0693609c96cae1c1d6323df28ed889b1cfc11'
assert not list(root.rglob('*.db')) and not list(root.rglob('*.sqlite'))
print('PASS model SHA256, no database files in package')
