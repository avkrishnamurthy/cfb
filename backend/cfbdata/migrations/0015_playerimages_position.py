# Generated by Django 4.2.3 on 2023-08-14 14:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cfbdata", "0014_playerimages_team"),
    ]

    operations = [
        migrations.AddField(
            model_name="playerimages",
            name="position",
            field=models.CharField(default="QB"),
            preserve_default=False,
        ),
    ]
