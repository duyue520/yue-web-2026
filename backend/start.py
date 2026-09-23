"""No auto-migration. Missing secrets, DB schema or model are fatal."""
import os
from server.config import DATABASE_URL, SECRET_KEY, CORS_ORIGINS
from server.database import init_db
import uvicorn

if __name__ == '__main__':
    try:
        init_db()
    except Exception as error:
        raise SystemExit('Database unavailable or migration missing (' + type(error).__name__ + '). Run reviewed migrations; no SQLite fallback.') from None
    port = int(os.environ.get('PORT','7860'))
    if not 1 <= port <= 65535:
        raise SystemExit('Invalid PORT')
    uvicorn.run('server.main:app', host='0.0.0.0', port=port, workers=1,
                proxy_headers=False, limit_concurrency=4, timeout_keep_alive=5)
