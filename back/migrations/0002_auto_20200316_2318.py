# Generated by Django 2.2.5 on 2020-03-16 18:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('back', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='test',
            name='slug',
            field=models.SlugField(allow_unicode=True, blank=True, null=True),
        ),
    ]
