from django.db import models
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.db.models.signals import post_delete, post_save, pre_save
from django.contrib.auth.models import User
import os
import time

def get_img_path(instance, filename):
	return('user_img/{0} {1}'.format(f'{instance.user.username} {instance.user.first_name} {instance.user.last_name}',filename))

class Test(models.Model):
	test_name = models.CharField(max_length = 100, null = False, blank = False, unique = True)
	test_description = models.TextField(max_length = 200, null = False, blank = False, unique = True)
	active = models.BooleanField(default = False,null = False, blank = False)
	slug = models.SlugField(allow_unicode = True, null = True, blank = True)
	duration = models.DecimalField(max_digits = 5, decimal_places = 0)
	def __str__(self):
		return(f'{self.test_name}')

class Question(models.Model):
	question_text = models.TextField(max_length = 250, null = False, blank = False)
	question_answer = models.TextField(max_length = 100, null = False, blank = False)
	test_model = models.ForeignKey(Test, on_delete = models.CASCADE, null = False, blank = False)
	def __str__(self):
		return(f'{self.test_model.test_name} - {self.question_text}')

class Answer(models.Model):
	answer_text = models.TextField(max_length = 100, null = False, blank = False)
	question_model = models.ForeignKey(Question, on_delete = models.CASCADE, related_name = 'answers')
	def __str__(self):
		return(f'{self.question_model.question_text} - {self.answer_text}')

class Test_result(models.Model):
	completed = models.BooleanField()
	result = models.DecimalField(max_digits = 3, decimal_places = 0)
	test = models.ForeignKey(Test, on_delete = models.CASCADE)
	user = models.ForeignKey(User, on_delete = models.CASCADE)
	def __str__(self):
		return(f'{self.user.first_name} - {self.user.last_name} - {self.test.test_name} - {self.result}%')

class Test_timer(models.Model):
	start_time = models.CharField(max_length = 100, null = True, blank = True)
	duration = models.DecimalField(max_digits = 5, decimal_places = 0)
	user = models.ForeignKey(User, on_delete = models.CASCADE)
	test = models.ForeignKey(Test, on_delete = models.CASCADE)
	def __str__(self):
		return(f'{self.user.username} - {self.test.test_name} - {self.start_time}')
		
@receiver(pre_save,sender = Test_timer)
def add_time(sender, instance, **kwargs):
	if not instance.start_time:
		instance.start_time = str(time.time()).split('.')[0]

@receiver(pre_save, sender = Test)
def add_slug(sender, instance, **kwargs):
	if not instance.slug:
		instance.slug = instance.test_name.replace(' ','-')

@receiver(post_save, sender = User)
def create_user_account(sender,instance,created,**kwargs):
	if created:
		Token.objects.create(user = instance)
