from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from .models import * # Adjust import based on your models
from .serializers import *

User = get_user_model()

class UserAPITestCase(APITestCase):

    def setUp(self):
        self.register_url = reverse('RegisterView')  # Adjust to your actual URL name
        self.token_url = reverse('Token')  # Adjust to your actual URL name
        
        # Sample data for user registration
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword',
            'password2': 'testpassword',
            'fullname': 'Test User',
            'gender': 1,
            'dob': '2000-01-01',
            'image': '',
            'cni': '',
            'require_diploma': False,
            'birth_certificate': ''
        }

    def test_user_registration(self):
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)

    def test_token_obtain_pair(self):
        # First, register the user
        self.client.post(self.token_url, self.user_data)

        response = self.client.post(self.token_url, {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

class SubjectQuestionAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )
        self.client.force_authenticate(user=self.user)  # Authenticate user

        self.subject = Subject.objects.create(title='Mathematics')  # Create a subject
        self.exam_session = ExamSession.objects.create(name='Midterm Exam')  # Create an exam session

        self.question_url = reverse('questions', args=[self.subject.id])  # Adjust to your actual URL name

    def test_create_question(self):
        response = self.client.post(self.question_url, {
            'title': 'What is 2 + 2?',
            'exam_session_id': self.exam_session.id,  # Use the created exam session ID
            'answers': [
                {'answer_text': '4', 'is_right': True},
                {'answer_text': '5', 'is_right': False}
            ]
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Question.objects.count(), 1)

    def test_create_question_without_exam_session(self):
        response = self.client.post(self.question_url, {
            'title': 'What is 2 + 2?',
            'answers': [
                {'answer_text': '4', 'is_right': True},
                {'answer_text': '5', 'is_right': False}
            ]
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Exam session ID is required.', response.data['error'])

    def test_create_question_with_invalid_exam_session(self):
        response = self.client.post(self.question_url, {
            'title': 'What is 2 + 2?',
            'exam_session_id': 9999,  # Invalid ID
            'answers': [
                {'answer_text': '4', 'is_right': True},
                {'answer_text': '5', 'is_right': False}
            ]
        })
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('Exam session not found.', response.data['error'])
