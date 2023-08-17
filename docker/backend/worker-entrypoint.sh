#!/bin/sh

until cd /app/backend
do
    echo "Waiting for server volume..."
done

celery -A cfehome worker --loglevel=info --concurrency 1 -E

sleep 10