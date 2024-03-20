FROM python:3.10-slim

# Install PostgreSQL development files
RUN apt-get update && apt-get install -y postgresql-server-dev-all

WORKDIR /app 

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

ENV ENVIRONMENT=production

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
