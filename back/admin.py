from django.contrib import admin
from . import models


class Test_results(admin.ModelAdmin):
	def time_seconds(self, obj):
		return obj.data_stop.strftime("%d %b %Y %H:%M:%S")
	time_seconds.admin_order_field = 'data_stop'
	time_seconds.short_description = 'Precise Time' 
	list_display=('user','test','result','duration','time_seconds')
	list_filter = ('test',)
	search_fields = ('test__test_name',)

admin.site.register(models.Test)
admin.site.register(models.Question)
admin.site.register(models.Answer)
admin.site.register(models.Test_result, Test_results)
admin.site.register(models.Test_timer)
admin.site.register(models.RightAnswer)
# Register your models here.
