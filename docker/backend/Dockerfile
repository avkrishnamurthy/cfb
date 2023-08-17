FROM python:3.8.15-alpine

RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev libc-dev libffi-dev

WORKDIR /app

RUN pip install --upgrade pip
RUN pip install gunicorn
RUN pip install psycopg2
RUN pip install wheel
ADD ./requirements.txt /app/
RUN pip install -r requirements.txt

ADD ./backend /app/backend
ADD ./docker /app/docker

RUN chmod +x /app/docker/backend/server-entrypoint.sh
RUN chmod +x /app/docker/backend/worker-entrypoint.sh
RUN chmod +x /app/docker/backend/beat-entrypoint.sh
RUN chmod +x /app/docker/backend/fetch_initial_games.sh
