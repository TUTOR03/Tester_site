# Generated by Django 2.2.5 on 2020-04-02 11:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('back', '0024_auto_20200402_1642'),
    ]

    operations = [
        migrations.AlterField(
            model_name='test_result',
            name='data_stop',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
