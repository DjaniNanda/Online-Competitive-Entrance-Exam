from django.shortcuts import render,get_object_or_404
from .models import *
from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics,status
from rest_framework.permissions import AllowAny,IsAuthenticated,IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework.views import APIView
from django.http import Http404
from django.db.models import Avg,Sum
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from rest_framework.exceptions import NotFound
from django.db import transaction
import logging
import random
import datetime

 
from django.contrib.auth import get_user_model

from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import redirect

from rest_framework import response
from django.http import HttpResponse
import stripe
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from rest_framework.generics import RetrieveAPIView
from rest_framework import permissions

from .models import PaymentHistory 
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings

from django.utils import timezone

API_URL="http/locahost:8000"

User = get_user_model()

logger = logging.getLogger(__name__)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListCreateSubject(generics.ListCreateAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    
    def perform_create(self, serializer):
        serializer.save()

class RetrieveUpdateDestroySubject(generics.RetrieveUpdateDestroyAPIView):
   
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    lookup_url_kwarg = "subject_id"
    


class SubjectQuestion(APIView):
    
    def get(self, request, format=None, **kwargs):
        """
        Retrieve questions for a specific subject.
        """
        questions = Question.objects.filter(subject_id=kwargs["subject_id"])
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)

    def post(self, request, format=None, **kwargs):
        """
        Create a new question for a specific subject.
        """
        try:
            subject = Subject.objects.get(id=kwargs["subject_id"])
        except Subject.DoesNotExist:
            return Response({"error": "Subject not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Extract exam session ID from the request data
        exam_session_id = request.data.get("exam_session_id")

        # Ensure the exam session ID is provided
        if not exam_session_id:
            return Response({"error": "Exam session ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate that the ExamSession exists
        try:
            exam_session = ExamSession.objects.get(id=exam_session_id)
        except ExamSession.DoesNotExist:
            return Response({"error": "Exam session not found."}, status=status.HTTP_404_NOT_FOUND)

        # Create a serializer instance with the request data
        serializer = QuestionSerializer(data=request.data)

        if serializer.is_valid():
            try:
                # Save the question with the subject and exam session
                question = serializer.save(exam_session=exam_session, subject=subject)
                return Response(
                    {"message": "Question created successfully", "data": QuestionSerializer(question).data},
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                logger.error("Error while saving question: %s", str(e))
                return Response(
                    {"error": "An error occurred while saving the question.", "details": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(
            {"error": "Invalid data", "details": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

class SubjectQuestionDetail(APIView):
    
    def get_object(self, pk):
        try:
            return Question.objects.get(id=pk)
        except Question.DoesNotExist:
            raise Http404
    
    def get(self, request):
        try:
            # Fetch a random question directly from the database
            questions = Question.objects.order_by('?')[:1]  # Get 1 random question
            serializer = QuestionSerializer(questions, many=True)  # Serialize the questions
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            # Log the exception (optional)
            # logger.error(f"Error fetching questions: {str(e)}")
            return Response({"error": "An error occurred while fetching questions."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def patch(self, request, pk, format=None):
        question = self.get_object(pk)
        serializer = QuestionSerializer(question, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk, format=None):
        question = self.get_object(pk)
        question.delete()
        return Response(
                {"message": "Question deleted successfully"},
                status= status.HTTP_204_NO_CONTENT
            )

class Ranking(APIView):
    
    def get(self, request, subject_id):
        results = Result.objects.filter(subject_id=subject_id).values('user__username').annotate(average_score=Avg('score')).order_by('-average_score')
    
        return Response(results, status=status.HTTP_200_OK)
    
class ExamSessionCreate(generics.CreateAPIView):
   
    queryset = ExamSession.objects.all()
    serializer_class = ExamSessionSerializer

    def get(self, request):
        # Fetch all exam sessions
        sessions = self.get_queryset() # This will return all instances of ExamSession

        # Serialize the queryset
        serializer = ExamSessionSerializer(sessions, many=True)  # Use many=True for multiple instances
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class RetrieveUpdateDestroyExamSession(generics.RetrieveUpdateDestroyAPIView):
   
    queryset = ExamSession.objects.all()  # Define the queryset
    serializer_class = ExamSessionDetailSerializer  # Specify the serializer

    def get(self, request, pk):
        session = self.get_object()  # Use the built-in method to get the object
        serializer = self.get_serializer(session)  # Serialize the object
        return Response(serializer.data)
    
class SessionRanking(APIView):
    
    def get(self, request, session_id):
        results = Result.objects.filter(exam_session_id=session_id).values('user__username').annotate(total_score=Sum('score')).order_by('-total_score')
        
        if not results:
            return Response({'detail': 'No results found for this session.'}, status=status.HTTP_404_NOT_FOUND)

        return Response(results, status=status.HTTP_200_OK)
    
class OverallRanking(APIView):
    def get(self, request):  
        results = Result.objects.values('user__username','user__id').annotate(total_score=Sum('score')).order_by('-total_score')
        
        if not results:
            return Response({'detail': 'No results found.'}, status=status.HTTP_404_NOT_FOUND)

        return Response(results, status=status.HTTP_200_OK)

 
class CandidateResult(APIView):

    def get(self, request, user_id=None):
        # If no user_id is provided, use the authenticated user
        if user_id is None:
            user = request.user
        else:
            # Optionally, you can check if the requesting user is allowed to view another user's results
            user = User.objects.filter(id=user_id).first()
            if user is None:
                return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)
            

        results = Result.objects.filter(user=user).values('subject__title', 'score')

        if not results:
            return Response({"message": "No results found."}, status=status.HTTP_404_NOT_FOUND)

        return Response(results, status=status.HTTP_200_OK)
        
class SubmitAnswer(APIView):
   

    def post(self, request, *args, **kwargs):
        user = request.user# Get the authenticated user from the request
        subject_id = request.data.get('subject_id')  # Expecting subject ID
        answers_data = request.data.get('answers', {})  # Expecting a dictionary of question_id: selected_answer_id

        total_score = 0

    # Use a transaction to ensure atomicity
        with transaction.atomic():
            for question_id, selected_answer_id in answers_data.items():
                try:
                # Fetch the selected answer
                    selected_answer = Answer.objects.get(id=selected_answer_id)

                # Create UserAnswer instance
                    user_answer = UserAnswer.objects.create(
                        user=user,
                        question_id=question_id,
                        selected_answer=selected_answer,
                          # Assuming exam session ID is sent in the request
                    )

                # Check if the answer is correct and update the score
                    if selected_answer.is_right:
                        total_score += 1  # Increment score for correct answers

                except Answer.DoesNotExist:
                    return Response({'error': f'Selected answer not found for question ID: {question_id}'}, status=status.HTTP_400_BAD_REQUEST)

                except Exception as e:
                    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Create Result instance
        result = Result.objects.create(
            user=user,
            subject_id=subject_id,  # Use the subject ID directly
            score=total_score
    )

        return Response({'score': total_score, 'result_id': result.id}, status=status.HTTP_201_CREATED)
class SubjectCountView(APIView):
         def get(self, request):
            total_subjects = Subject.objects.count()
            return Response({'total_subjects': total_subjects})

class QuestionCountView(APIView):
         def get(self, request):
            total_questions = Question.objects.count()
            return Response({'total_questions': total_questions})
         
class CandidateListView(generics.ListAPIView):
    queryset = User.objects.filter(groups__name='candidate', is_active=False)  # Only fetch inactive candidates
    serializer_class = UserSerializer  # Create a serializer for User

class ActivatedCanditedView(generics.ListAPIView):
    queryset = User.objects.filter(groups__name='candidate', is_active=True)  # Only fetch inactive candidates
    serializer_class = UserSerializer  # Create a serializer for User 

class ActivateCandidateView(APIView):

    def post(self, request, pk):
        """Activate a candidate by setting is_active to True."""
        try:
            candidate = User.objects.get(pk=pk, groups__name='candidate')
            candidate.is_active = True
            candidate.save()
            return Response({"detail": "Candidate activated successfully."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"detail": "Candidate not found."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        """Delete a candidate."""
        try:
            candidate = User.objects.get(pk=pk, groups__name='candidate')
            candidate.delete()
            return Response({"detail": "Candidate deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"detail": "Candidate not found."}, status=status.HTTP_404_NOT_FOUND)

class ApprovedCandidateCountView(APIView):
    def get(self, request):
        total_approved_candidates = User.objects.filter(groups__name='candidate', is_active=True).count()
        return Response({'total_approved_candidates': total_approved_candidates})

class PendingCandidateCountView(APIView):
    def get(self, request):
        total_pending_candidates = User.objects.filter(groups__name='candidate', is_active=False).count()
        return Response({'total_pending_candidates': total_pending_candidates})

class CandidateCountView(APIView):
    def get(self, request):
        # Count the total number of teachers
        total_candidates = User.objects.filter(groups__name='candidate').count()
        return Response({'total_candidates': total_candidates})


class TeacherListView(generics.ListAPIView):
    queryset = User.objects.filter(groups__name='teacher', is_active=False)  # Only fetch inactive candidates
    serializer_class = UserSerializer  # Create a serializer for User
    
class ActivatedTeacherView(generics.ListAPIView):
    queryset = User.objects.filter(groups__name='teacher', is_active=True)  # Only fetch inactive candidates
    serializer_class = UserSerializer  # Create a serializer for User

class ActivateTeacherView(APIView):

    def post(self, request, pk):
        try:
            teacher = User.objects.get(pk=pk, groups__name='teacher')
            teacher.is_active = True
            teacher.save()
            return Response({"detail": "teacher activated successfully."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"detail": "teacher not found."}, status=status.HTTP_404_NOT_FOUND)
        
    def delete(self, request, pk):
        """Delete a teacher."""
        try:
            teacher = User.objects.get(pk=pk, groups__name='teacher')
            teacher.delete()
            return Response({"detail": "teacher deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"detail": "teacher not found."}, status=status.HTTP_404_NOT_FOUND)

class TeacherCountView(APIView):
    def get(self, request):
        # Count the total number of teachers
        total_teachers = User.objects.filter(groups__name='teacher').count()
        return Response({'total_teachers': total_teachers})
    
class TeacherListView(generics.ListAPIView):
    queryset = User.objects.filter(groups__name='teacher', is_active=False)  # Only fetch inactive candidates
    serializer_class = UserSerializer

class ApprovedTeacherCountView(APIView):
    def get(self, request):
        total_approved_teachers = User.objects.filter(groups__name='teacher', is_active=True).count()
        return Response({'total_approved_teachers': total_approved_teachers})

class PendingTeacherCountView(APIView):
    def get(self, request):
        total_pending_teachers = User.objects.filter(groups__name='teacher', is_active=False).count()
        return Response({'total_pending_teachers': total_pending_teachers})


class StripeCheckoutView(APIView):
    def post(self, request):
        try:
            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        'price': 'price_1QBe1aC4xWdm1X5jhAVjsMTJ',
                        'quantity': 1,
                    },
                ],
                payment_method_types=['card',],
                mode='payment',
                success_url=settings.SITE_URL + '/?success=true&session_id={CHECKOUT_SESSION_ID}',
                cancel_url=settings.SITE_URL + '/?canceled=true',
            )

            return redirect(checkout_session.url)
        except:
            return Response(
                {'error': 'Something went wrong when creating stripe checkout session'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@csrf_exempt
def stripewebhookview(request):
    payload = request.body
    endpoint = settings.STRIPE_SECRET_WEBHOOK
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    event = None

    try:
        event = stripe.Webhook.construct_event(
        payload, sig_header, endpoint
        )
    except ValueError as e:
        # Invalid payload
        return Response(status=400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return Response(status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']

        print(session)
        customer_email=session['customer_details']['email']
        
       
        #sending confimation mail
        send_mail(
            subject="payment sucessful",
            message=f"thank for your purchase your order is ready.  ",
            recipient_list=[customer_email],
            from_email="admin@site.com"
        )

        #creating payment history
        user=User.objects.get(email=customer_email) or None

        PaymentHistory.objects.create( user=user, payment_status=True)
    # Passed signature verification
    return HttpResponse(status=200)

class LatestExamSessionView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            # Get the current date and time
            now = timezone.now()
            current_date = now.date()

            # Fetch the latest ExamSession
            latest_session = ExamSession.objects.filter(
                end_date__gte=current_date
            ).order_by('start_date', 'start_time').last()

            if latest_session:
                # Combine date and time fields
                start_datetime = datetime.datetime.combine(latest_session.start_date, latest_session.start_time)
                end_datetime = datetime.datetime.combine(latest_session.end_date, latest_session.end_time)

                data = {
                    'name': latest_session.name,
                    'start_time': start_datetime.isoformat(),
                    'end_time': end_datetime.isoformat(),
                }
                return Response(data)
            else:
                return Response({'error': 'No upcoming exam sessions found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST'])
def deactivate_user(request):
    user_id = request.data.get('user_id')

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    with transaction.atomic():
        # Deactivate the user
        user.is_active = False
        user.save()

        # Remove the user from all groups
        user.groups.clear()

    return Response({"message": "User deactivated successfully."}, status=status.HTTP_200_OK)


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/register/',
        '/api/token/refresh/',
        '/api/subject/',
        '/api/subject/<int:subject_id>/',
        '/api/question/<int:subject_id>/',
        '/api/question/detail/'
        '/api/question/detail/<int:pk>/',
        '/api/result',
        '/api/exam-session/',
        'api/candidates/',
        'api/candidates/activate/<int:pk>/'
        '/api/exam-session/<int:pk>/'
    ]
    return Response(routes)

