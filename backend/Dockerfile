FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1 \
    PORT=7860 OMP_NUM_THREADS=2 MKL_NUM_THREADS=2
RUN useradd --create-home --uid 1000 app
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir torch==2.11.0 torchvision==0.26.0 --index-url https://download.pytorch.org/whl/cpu \
 && pip install --no-cache-dir -r requirements.txt
COPY --chown=1000:1000 server ./server
COPY --chown=1000:1000 weights/best_model.pth ./weights/best_model.pth
COPY --chown=1000:1000 migrations ./migrations
COPY --chown=1000:1000 alembic.ini start.py ./
USER 1000
EXPOSE 7860
HEALTHCHECK --interval=60s --timeout=20s --start-period=120s --retries=3 CMD python -c "import os,urllib.request; urllib.request.urlopen('http://127.0.0.1:'+os.environ.get('PORT','7860')+'/api/health', timeout=15)"
CMD ["python", "start.py"]
