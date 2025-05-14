FROM python:3.9-slim

WORKDIR /app

COPY challenge.py /app/
COPY serve.py /app/

EXPOSE 9003

CMD ["python", "serve.py"] 