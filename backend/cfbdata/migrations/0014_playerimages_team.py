# Generated by Django 4.2.3 on 2023-08-14 13:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("cfbdata", "0013_playerimages"),
    ]

    operations = [
        migrations.AddField(
            model_name="playerimages",
            name="team",
            field=models.ForeignKey(
                default=239,
                on_delete=django.db.models.deletion.CASCADE,
                to="cfbdata.team",
            ),
            preserve_default=False,
        ),
    ]