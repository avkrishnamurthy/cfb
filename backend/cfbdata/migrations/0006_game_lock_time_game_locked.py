# Generated by Django 4.2.3 on 2023-08-09 03:34

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ("cfbdata", "0005_game_prediction"),
    ]

    operations = [
        migrations.AddField(
            model_name="game",
            name="lock_time",
            field=models.DateTimeField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="game", name="locked", field=models.BooleanField(default=False),
        ),
    ]