# Generated by Django 4.2.3 on 2023-08-14 04:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cfbdata", "0012_alter_favoriteteam_user"),
    ]

    operations = [
        migrations.CreateModel(
            name="PlayerImages",
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
                ("player", models.CharField()),
                ("img", models.URLField()),
            ],
        ),
    ]
