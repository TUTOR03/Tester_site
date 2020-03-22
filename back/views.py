from django.shortcuts import render
from rest_framework import generics,permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from .models import Test, Question, Answer, Test_result, Test_timer
from .serializers import TestListSerializer, UserRegisterSerializer, QuestionSerializer, TestSingleTimerSerializer
from rest_framework.authtoken.views import ObtainAuthToken

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
def TestSingleTimerAPIview(request,slug):
	data = Test_timer.objects.get(test = Test.objects.get(slug = slug), user = request.user)
	serializer = TestSingleTimerSerializer(data)
	print(serializer)
	return Response(serializer.data, status = status.HTTP_200_OK)

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
			'username': user.username,
			'first_name': user.first_name,
			'last_name': user.last_name, 
		})	