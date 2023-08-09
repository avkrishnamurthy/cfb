# Generated by Django 4.2.3 on 2023-08-08 22:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("cfbdata", "0004_favoriteteam"),
    ]

    operations = [
        migrations.CreateModel(
            name="Game",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("game_id", models.IntegerField()),
                ("year", models.IntegerField()),
                ("week", models.IntegerField()),
                ("home", models.CharField()),
                ("away", models.CharField()),
                ("line", models.CharField(blank=True, null=True)),
                ("home_points", models.IntegerField(blank=True, null=True)),
                ("away_points", models.IntegerField(blank=True, null=True)),
                (
                    "away_team",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="away_games",
                        to="cfbdata.team",
                    ),
                ),
                (
                    "home_team",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="home_games",
                        to="cfbdata.team",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Prediction",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("home_points_prediction", models.IntegerField()),
                ("away_points_prediction", models.IntegerField()),
                ("score", models.IntegerField(blank=True, null=True)),
                (
                    "game",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="cfbdata.game"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
