#!/bin/sh

until cd /app/backend
do
    echo "Waiting for server volume..."
done

echo "Calling fetch games"

celery -A cfehome call cfbdata.tasks.fetch_games