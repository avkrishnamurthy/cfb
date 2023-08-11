# Generated by Django 4.2.3 on 2023-08-11 01:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cfbdata", "0006_game_lock_time_game_locked"),
    ]

    operations = [
        migrations.RemoveField(model_name="prediction", name="away_points_prediction",),
        migrations.RemoveField(model_name="prediction", name="home_points_prediction",),
        migrations.AddField(
            model_name="prediction",
            name="home_winner",
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="prediction",
            name="week",
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="prediction",
            name="year",
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]