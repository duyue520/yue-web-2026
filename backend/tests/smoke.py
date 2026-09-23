"""Synthetic in-memory DB only; never reads the original app.db or remote DB."""
import os, sys, io
from pathlib import Path
root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root / '.test-deps'))
sys.path.insert(0, str(root))
os.environ.update(DATABASE_URL='postgresql://test:test@localhost/test?sslmode=require',
                  SECRET_KEY='synthetic-test-secret-not-for-production-123456',
                  CORS_ORIGINS='https://frontend.example')
from sqlalchemy import create_engine, text, event
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker
import server.database as database
original_engine = database.engine
original_engine.dispose()
engine = create_engine('sqlite://', connect_args={'check_same_thread': False}, poolclass=StaticPool)
@event.listens_for(engine, 'connect')
def enable_fk(connection, _):
    connection.execute('PRAGMA foreign_keys=ON')
database.engine = engine
database.SessionLocal = sessionmaker(bind=engine)
from server.main import app
# Importing app must not have created any tables.
from sqlalchemy import inspect
assert inspect(engine).get_table_names() == []
database.Base.metadata.create_all(engine)
with engine.begin() as c:
    c.execute(text('CREATE TABLE alembic_version(version_num VARCHAR(32) NOT NULL)'))
    c.execute(text("INSERT INTO alembic_version VALUES ('0001')"))
from fastapi.testclient import TestClient
from PIL import Image
with TestClient(app, raise_server_exceptions=True) as client:
    assert client.get('/api/health').json()['model_loaded']
    def register(name):
        r = client.post('/api/auth/register', json={'username':name,'password':'testpass123'})
        assert r.status_code == 200, r.text
        return {'Authorization':'Bearer ' + r.json()['access_token']}
    alice, bob = register('synthetic_alice'), register('synthetic_bob')
    r = client.post('/api/guestbook', headers=alice, json={'nickname':'test','content':'Synthetic persistence test'})
    assert r.status_code == 200, r.text
    mid = r.json()['data']['id']
    assert client.get('/api/guestbook').json()['total'] == 1
    assert client.delete(f'/api/guestbook/{mid}',headers=bob).status_code == 403
    assert client.delete(f'/api/guestbook/{mid}',headers=alice).status_code == 200
    assert client.get('/api/guestbook').json()['total'] == 0
    assert client.post('/api/guestbook',headers={'Authorization':'Bearer invalid'},json={'nickname':'x','content':'x'}).status_code == 401
    r = client.post('/api/blog/articles',headers=alice,json={'title':'Synthetic','content':'Body'})
    assert r.status_code == 200, r.text
    aid = r.json()['article_id']
    r = client.post(f'/api/blog/articles/{aid}/comments',json={'content':'anonymous synthetic'})
    assert r.status_code == 200, r.text
    assert client.delete(f'/api/blog/articles/{aid}',headers=bob).status_code == 403
    preflight = client.options('/api/guestbook',headers={'Origin':'https://frontend.example','Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'authorization,content-type'})
    assert preflight.status_code == 200, preflight.text
    assert preflight.headers['access-control-allow-origin'] == 'https://frontend.example'
    assert 'access-control-allow-origin' not in client.get('/api/health',headers={'Origin':'https://untrusted.example'}).headers
    img = io.BytesIO()
    Image.new('RGB',(224,224),(50,120,50)).save(img,format='PNG')
    r = client.post('/api/predict',headers=alice,files={'image':('synthetic.png',img.getvalue(),'image/png')})
    assert r.status_code == 200, r.text
    assert len(r.json()['predictions']) == 3 and r.json()['diagnosis_id'] is not None
    assert client.get('/api/auth/history',headers=alice).json()['total'] == 1
    assert client.get('/api/auth/history',headers=bob).json()['total'] == 0
    assert client.get('/api/export/excel',headers=alice).status_code == 200
print('PASS: real model load/inference; synthetic DB; auth; guestbook; ownership; anonymous FK; CORS; history; Excel')
print('NOT VERIFIED: remote PostgreSQL, Docker image, hosting, network, real restart durability')
