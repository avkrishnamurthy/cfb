from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
# from datetime import datetime

# Set the default Django settings module for the 'celery' program.
# "sample_app" is name of the root app
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cfehome.settings')

app = Celery( 'celery_app',
               broker='redis://localhost:6379/0',
               backend='redis://localhost:6379/0'
            )
app.config_from_object("django.conf:settings", namespace="CELERY")
            
# Load task modules from all registered Django apps.
app.autodiscover_tasks()