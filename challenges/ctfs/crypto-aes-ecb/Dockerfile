FROM python:3.9-slim

WORKDIR /app

RUN pip install pycryptodome

COPY challenge.py /app/
COPY serve.py /app/

EXPOSE 9005

CMD ["python", "serve.py"] 