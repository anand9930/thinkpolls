# Generated by Django 2.1.4 on 2019-06-27 17:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Imageoption',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image_option_url', models.URLField()),
            ],
        ),
        migrations.CreateModel(
            name='Imagepolldetail',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=1000)),
                ('poll_url', models.CharField(max_length=80)),
            ],
        ),
        migrations.AddField(
            model_name='imageoption',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='options', to='imagepolls.Imagepolldetail'),
        ),
    ]
