# Generated by Django 2.2.5 on 2020-04-02 11:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('back', '0020_auto_20200331_0118'),
    ]

    operations = [
        migrations.AddField(
            model_name='test_result',
            name='data_stop',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='test_result',
            name='duration',
            field=models.DecimalField(decimal_places=0, default=312, max_digits=5),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='test_result',
            name='result',
            field=models.DecimalField(decimal_places=2, max_digits=5),
        ),
    ]