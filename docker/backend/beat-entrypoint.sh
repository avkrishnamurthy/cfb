#!/bin/sh

until cd /app/backend
do
    echo "Waiting for server volume..."
done

celery -A cfehome call cfbdata.tasks.fetch_games

celery -A cfehome.celery beat