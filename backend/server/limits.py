"""Single-worker bounded request buffer and global write budget (no proxy-IP trust)."""
import time
from collections import deque
from starlette.responses import JSONResponse

class LimitsMiddleware:
    def __init__(self, app):
        self.app = app
        self.writes = deque()

    async def __call__(self, scope, receive, send):
        if scope['type'] != 'http':
            return await self.app(scope, receive, send)
        if scope['method'] not in {'POST', 'PUT', 'PATCH'}:
            return await self.app(scope, receive, send)
        now = time.monotonic()
        while self.writes and self.writes[0] < now - 60:
            self.writes.popleft()
        if len(self.writes) >= 60:
            return await JSONResponse({'detail':'请求过多，请稍后重试'},429,headers={'Retry-After':'60'})(scope,receive,send)
        self.writes.append(now)
        chunks, size = [], 0
        while True:
            message = await receive()
            if message['type'] == 'http.disconnect':
                return
            body = message.get('body',b'')
            size += len(body)
            if size > 12 * 1024 * 1024:
                return await JSONResponse({'detail':'请求总大小不能超过 12MB'},413)(scope,receive,send)
            chunks.append(body)
            if not message.get('more_body',False):
                break
        body = b''.join(chunks)
        delivered = False
        async def replay():
            nonlocal delivered
            if not delivered:
                delivered = True
                return {'type':'http.request','body':body,'more_body':False}
            return await receive()
        await self.app(scope,replay,send)
