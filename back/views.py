from django.shortcuts import render
from rest_framework import generics,permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from .models import Test, Question, Answer, Test_result, Test_timer, RightAnswer
from .serializers import TestListSerializer, UserRegisterSerializer, QuestionSerializer, TestTimerSerializer, CreateTestTimerSerializer
from rest_framework.authtoken.views import ObtainAuthToken
from datetime import datetime
from django.http import HttpResponse
import xlwt
from django.conf import settings
import os
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string

def toFixed(num, digits=0):
	return f'{num:.{digits}f}'

#TEST ACTIONS
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def TestListAPIview(request):
	data = Test.objects.all()
	serializer = TestListSerializer(data, many = True,context={'user': request.user})
	return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def CreateTestAPIview(request):
	new_test = Test(test_name = request.data['test_title'], test_description = request.data['test_description'], duration = 200)
	new_test.save()
	for qs in request.data['questions']:
		new_que = Question(question_text = qs['q_text'], test_model = new_test)
		new_que.save()
		for ans in qs['q_answers']:
			new_ans = Answer(answer_text = ans['a_text'], question_model = new_que)
			new_ans.save()
			if(ans['a_right']):
				new_right_ans = RightAnswer(question = new_que, answer = new_ans)
				new_right_ans.save()
	print('-'*35,request.data)
	return Response(status = status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def TestSingleAPIview(request,slug):
	test_data = Test.objects.get(slug = slug)
	test_serializer = TestListSerializer(test_data,context={'user': request.user})
	question_data = Question.objects.filter(test_model = test_data)
	question_serializer = QuestionSerializer(question_data, many = True)
	return Response([test_serializer.data,question_serializer.data], status = status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def TestTimerAPIview(request):
	try:
		data = Test_timer.objects.filter(user=request.user)
		serializer = TestTimerSerializer(data, many=True)
		return Response(serializer.data, status = status.HTTP_200_OK)
	except:
		return Response([], status = status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def CreateTestTimerAPIview(request):
	data = request.data
	data['user'] = request.user.id
	try:
		obj = Test_timer.objects.get(user = data['user'], test = data['test'])
		return Response(status = status.HTTP_403_FORBIDDEN)
	except:
		serializer = CreateTestTimerSerializer(data = data)
		if serializer.is_valid():
			serializer.save()
			return Response(status = status.HTTP_201_CREATED)
		else:
			return Response(serializer.errors,status = status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def GetTestResultAPIview(request):
	timer = Test_timer.objects.get(user = request.user, test = request.data['user']['test_id']).delete()
	max_point = len(Question.objects.filter(test_model = request.data['user']['test_id']))
	fact_point = 0
	for key in request.data['main_data']:
		right_data = list(map(lambda ob: ob.answer.id,list(RightAnswer.objects.filter(question = int(key.split('_')[1])))))
		fact_data = list(map(int,request.data['main_data'][key]))
		sorted(right_data)
		sorted(fact_data)
		if(fact_data == right_data):
			fact_point+=1
	new_result = Test_result(data_stop = datetime.now().strftime("%Y-%m-%d %H:%M:%S"), duration = request.data['user']['time_long'], completed = True, test = Test.objects.get(id = request.data['user']['test_id']), user = request.user, result = float(toFixed(100*(fact_point/max_point),2)))	
	new_result.save()	
	return Response(status = status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def GetExelPageAPIview(request,idx):
	results = list(map(list,Test_result.objects.filter(test = idx).values_list('user__first_name','user__last_name','result','duration','data_stop')))
	for i in range(len(results)):
		results[i][4] = results[i][4].strftime("%Y-%m-%d %H:%M:%S")
	wb = xlwt.Workbook(encoding = 'utf-8')
	ws = wb.add_sheet('Results')
	main_columns = ('Имя','Фамилия','Результат %','Время','Дата')
	font_style = xlwt.XFStyle()
	font_style.font.bold = True
	for col in range(len(main_columns)):
		ws.col(col).width = 256*20
		ws.write(0,col,main_columns[col],font_style)

	font_style = xlwt.XFStyle()
	for res in range(len(results)):
		for col in range(len(results[res])):
			ws.write(res+1,col,results[res][col],font_style)

	wb.save(f'media/results/{Test.objects.get(id=idx).test_name} results.xls')
	response = HttpResponse(content_type='application/ms-excel')
	response['Content-Disposition'] = f'attachment; filename="{Test.objects.get(id=idx).test_name} results.xls"'
	file = open(os.path.join(settings.MEDIA_ROOT,f'results/{Test.objects.get(id=idx).test_name} results.xls'),'rb')
	data = file.read()
	file.close()
	response.write(data)
	return response	

#USER ACTION
@api_view(['POST'])
@permission_classes([~permissions.IsAuthenticated])
def UserRegisterAPIview(request):
	serializer = UserRegisterSerializer(data = request.data)
	if serializer.is_valid():
		user_data={
			'first_name': serializer.validated_data['first_name'],
			'last_name': serializer.validated_data['last_name'],
			'email': serializer.validated_data['email'],
			'password': BaseUserManager().make_random_password(length = 7)
		}
		username = get_random_string(length = 7)
		while User.objects.filter(username = username).exists():
			username = get_random_string(length = 7)

		user_data['username'] = username
		new_user = User(
			username = user_data['username'],
			first_name = user_data['first_name'],
			last_name = user_data['last_name'],
			email = user_data['email'],
		)
		new_user.set_password(user_data['password'])
		new_user.save()
		user_data['is_admin'] = new_user.is_superuser
		user_data['user_id'] = new_user.id
		data = {
			'username': user_data['username'],
			'password': user_data['password']
		}

		return Response(data,status = status.HTTP_201_CREATED)
	else:
		return Response(status = status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def UserLogoutAPIview(request):
	token = Token.objects.get(user = request.user).delete()
	return Response(status = status.HTTP_200_OK)

class UserAuthToken(ObtainAuthToken):
	def post(self, request, *args, **kwargs):
		serializer = self.serializer_class(data=request.data,context={'request': request})
		serializer.is_valid(raise_exception=True)
		user = serializer.validated_data['user']
		token, created = Token.objects.get_or_create(user=user)
		return Response({
			'token': token.key,
			'user_id' : user.id,
			'first_name': user.first_name,
			'last_name': user.last_name,
			'is_admin': user.is_superuser 
		})	