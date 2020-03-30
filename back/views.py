from django.shortcuts import render
from rest_framework import generics,permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from .models import Test, Question, Answer, Test_result, Test_timer, RightAnswer
from .serializers import TestListSerializer, UserRegisterSerializer, QuestionSerializer, TestTimerSerializer, CreateTestTimerSerializer
from rest_framework.authtoken.views import ObtainAuthToken

def toFixed(num, digits=0):
	return f'{num:.{digits}f}'

#TEST ACTIONS
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def TestListAPIview(request):
	data = Test.objects.all()
	serializer = TestListSerializer(data, many = True,context={'user': request.user})
	return Response(serializer.data)

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
	new_result = Test_result(completed = True, test = Test.objects.get(id = request.data['user']['test_id']), user = request.user, result = float(toFixed(100*(fact_point/max_point),2)))	
	new_result.save()	
	print('-'*35,request.data)
	return Response(status = status.HTTP_200_OK)
#{'user': {'user_id': '1', 'test_id': 2, 'timer_id': 42}, 'main_data': {'q_2': ['4'], 'q_1': ['5', '3']}}

#USER ACTIONS
@api_view(['POST'])
@permission_classes([~permissions.IsAuthenticated])
def UserRegisterAPIview(request):
	serializer = UserRegisterSerializer(data = request.data)
	if serializer.is_valid():
		user = serializer.save()
		data = {}
		data['username'] = user.username
		data['first_name'] = user.first_name
		data['last_name'] = user.last_name
		data['token'] = Token.objects.get(user = user).key
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
		})	