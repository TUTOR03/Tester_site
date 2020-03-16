from django.db import models
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.db.models.signals import post_delete, post_save, pre_save
from django.contrib.auth.models import User

class Test(models.Model):
	test_name = models.CharField(max_length = 100, null = False, blank = False, unique = True)
	test_description = models.TextField(max_length = 200, null = False, blank = False, unique = True)
	slug = models.SlugField(allow_unicode = True, null = True, blank = True)
	def __str__(self):
		return(f'{self.test_name}')
class Question(models.Model):
	question_text = models.TextField(max_length = 250, null = False, blank = False)
	question_answer = models.TextField(max_length = 100, null = False, blank = False)
	test_model = models.ForeignKey(Test, on_delete = models.CASCADE, null = False, blank = False)
	def __str__(self):
		return(f'{self.test_model.test_name}-{self.question_text}')
class Answer(models.Model):
	answer_text = models.TextField(max_length = 100, null = False, blank = False)
	question_model = models.ForeignKey(Question, on_delete = models.CASCADE)
	def __str__(self):
		return(f'{self.question_model.question_text}-{self.answer_text}')
class Account(models.Model):
	birth_date = models.DateField(auto_now = False, null = True, blank = True)
	user = models.OneToOneField(User, on_delete = models.CASCADE)
	def __str__(self):
		return(f'{self.user.username}-{self.user.first_name}-{self.user.last_name}-{self.birth_date}')

class Test_result(models.Model):
	completed = models.BooleanField()
	result = models.DecimalField(max_digits = 3, decimal_places = 0)
	test = models.ForeignKey(Test, on_delete = models.CASCADE)
	user = models.ForeignKey(User, on_delete = models.CASCADE)
	def __str__(self):
		return(f'{self.user.first_name}-{self.user.last_name}-{self.test.test_name}-{self.result}%')


@receiver(pre_save, sender = Test)
def add_slug(sender, instance, **kwargs):
	if not instance.slug:
		instance.slug = instance.test_name.replace(' ','-')

@receiver(post_save, sender = User)
def create_user_account(sender,instance,created,**kwargs):
	if created:
		ob = Account(user = instance)
		ob.save()