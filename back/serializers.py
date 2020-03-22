from rest_framework import serializers
from .models import Test, Test_result, Question, Answer, Test_timer
from django.contrib.auth.models import User

class TestSingleTimerSerializer(serializers.ModelSerializer):
	class Meta:
		model = Test_timer
		fields = [
			'start_time',
			'duration',
		]

class TestListSerializer(serializers.ModelSerializer):
	result = serializers.SerializerMethodField()
	completed = serializers.SerializerMethodField()
	class Meta:
		model = Test
		fields = [
			'test_name',
			'test_description',
			'slug',
			'result',
			'completed'
		]
	def get_result(self,instance):
		try:
			return Test_result.objects.get(user = self.context['user'], test = instance).result
		except:
			return None
	def get_completed(self,instance):
		try:
			return Test_result.objects.get(user = self.context['user'], test = instance).completed
		except:
			return None

class QuestionSerializer(serializers.ModelSerializer):
	answers = serializers.SerializerMethodField()
	class Meta:
		model = Question
		depth = 2
		fields = [
			'question_text',
			'test_model',
			'answers',
		]
	def get_answers(self,instance):
		return list(map(lambda ob: ob.answer_text,list(Answer.objects.filter(question_model = instance))))

class UserRegisterSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = [
			'username',
			'first_name',
			'last_name',
			'email',
			'password'
		]
	def save(self):
		user = User(
			username = self.validated_data['username'],
			first_name = self.validated_data['first_name'],
			last_name = self.validated_data['last_name'],
			email = self.validated_data['email'],
		)
		user.set_password(self.validated_data['password'])
		user.save()
		return(user)