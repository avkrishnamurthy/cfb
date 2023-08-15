"""
Django settings for cfehome project.

Generated by 'django-admin startproject' using Django 4.2.3.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
import datetime
from dotenv import load_dotenv
from os import getenv
from celery.schedules import crontab

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

CELERY_BROKER_URL = "redis://localhost:6379"
CELERY_RESULT_BACKEND = "redis://localhost:6379"
CELERY_TIMEZONE = "America/New_York"

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-q@v09c51u1qq=iiwoxuln4m(&q+r4(^nrw@iqxls!2hbx$^g^p"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "api",
    "products",
    "rest_framework",
    "rest_framework.authtoken",
    "search",
    "rest_framework_simplejwt",
    "corsheaders",
    "users",
    "cfbdata"
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "cfehome.urls"
CORS_URLS_REGEX = r"^/api/.*"
CORS_ALLOWED_ORIGINS = [
]
    
if DEBUG:
    CORS_ALLOWED_ORIGINS += [
        'http://localhost:8111',
        'http://localhost:3000'
    ]


TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "cfehome.wsgi.application"


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.sqlite3",
#         "NAME": BASE_DIR / "db.sqlite3",
#     }
# }

load_dotenv()
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': getenv("DB_NAME"),
        'USER': getenv("DB_USERNAME"),
        'PASSWORD': getenv("DB_PASSWORD"),
        'HOST': getenv("HOST"),  # Replace with your database host if not running locally
        'PORT': getenv("POSTGRES_PORT"),          # Replace with your database port if not using the default
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",},
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "America/New_York"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


auth_classes = [

]
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": ['rest_framework.authentication.SessionAuthentication',
                                       'api.authentication.TokenAuthentication',
                                       'rest_framework_simplejwt.authentication.JWTAuthentication',
                                       ],
    "DEFAULT_PERMISSION_CLASSES": ['rest_framework.permissions.IsAuthenticatedOrReadOnly'],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination", "PAGE_SIZE": 5
}

SIMPLE_JWT = {
    "AUTH_HEADER_TYPES": ['Bearer'],
    "ACCESS_TOKEN_LIFETIME": datetime.timedelta(minutes=3),
    "REFRESH_TOKEN_LIFETIME": datetime.timedelta(minutes=5),
}

CELERY_BEAT_SCHEDULE = {
    # 'Task_two_schedule' : { 
    #     'task': 'cfbdata.tasks.task_two',
    #     'schedule': 10,
    #     # 'args' : (datetime.now(), year, 0) # arguments for the task
    # },
    'Fetch_games_schedule': {
        'task': 'cfbdata.tasks.fetch_games',
        'schedule': crontab(hour=6, minute=0, day_of_week=2)
    },
    'Lock_games_schedule': {
        'task': 'cfbdata.tasks.lock_games',
        'schedule': crontab(minute="*/5")
    },
    'Score_games_schedule': {
        'task': 'cfbdata.tasks.score_games',
        'schedule': crontab(hour=4, minute=0, day_of_week=2)
    }
}