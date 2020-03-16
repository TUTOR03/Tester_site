from django.contrib import admin
from . import models

admin.site.register(models.Test)
admin.site.register(models.Question)
admin.site.register(models.Answer)
admin.site.register(models.Account)
admin.site.register(models.Test_result)
# Register your models here.
