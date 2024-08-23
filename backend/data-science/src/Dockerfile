FROM python:3.12

COPY . .
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 5000

ENTRYPOINT ["python", "api.py"]