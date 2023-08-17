#!/bin/sh

until cd /app/backend
do
    echo "Waiting for server volume..."
done


until python manage.py migrate
do
    echo "Waiting for db to be ready..."
    sleep 2
done

if [ ! -f /app/docker/backend/add_teams_executed ]; then
    python manage.py add_teams

    # Creating flag to indicate the command has been executed
    touch /app/docker/backend/add_teams_executed
fi

python manage.py collectstatic --noinput

gunicorn cfehome.wsgi --bind 0.0.0.0:8000 --workers 4 --threads 4
