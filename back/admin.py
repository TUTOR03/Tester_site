from django.contrib import admin
from . import models

admin.site.register(models.Test)
admin.site.register(models.Question)
admin.site.register(models.Answer)
admin.site.register(models.Test_result)
admin.site.register(models.Test_timer)
# Register your models here.
