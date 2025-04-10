from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='user_register'),
    path('subject/', ListCreateSubject.as_view(), name="subject_list"),
    path('subject/<int:subject_id>/', RetrieveUpdateDestroySubject.as_view(), name="subject_detail"),
    path('question/<int:subject_id>/', SubjectQuestion.as_view(), name="questions"),
    path('question/detail/<int:pk>/', SubjectQuestionDetail.as_view(), name="question_detail"),
    path('question/detail/', SubjectQuestionDetail.as_view(), name="question_detail"),
   path('submit/', SubmitAnswer.as_view(), name='submit_answers'),
    path('ranking/<int:subject_id>/', Ranking.as_view(), name='ranking'),
    path('overall-ranking/', OverallRanking.as_view(), name='overall_rankings'),
    path('candidate-results/<int:user_id>/', CandidateResult.as_view(), name='candidate-results-by-id'), 
    path('exam-session/', ExamSessionCreate.as_view(), name='create_exam_session'),
    path('exam-session/<int:pk>/', RetrieveUpdateDestroyExamSession.as_view(), name='exam_session_detail'),
    path('session-ranking/<int:session_id>/', SessionRanking.as_view(), name='session_rankings'),
    path('candidate-result/', CandidateResult.as_view(), name='candidate_result'),
    path('api/subject/count/', SubjectCountView.as_view(), name='subject-count'),
    path('api/question/count/', QuestionCountView.as_view(), name='question-count'),

    path('api/teachers/', TeacherListView.as_view(), name='teacher-list'),
    path('api/teachers/activate/<int:pk>/', ActivateTeacherView.as_view(), name='activate-teacher'),
    path('api/teachers/activate/', ActivatedTeacherView.as_view(), name='activate-teacherlist'),
    path('api/teacher/count/', TeacherCountView.as_view(), name='teacher-count'),
    path('api/teacher/approved/count/', ApprovedTeacherCountView.as_view(), name='approved_teacher_count'),
    path('api/teacher/pending/count/', PendingTeacherCountView.as_view(), name='pending_teacher_count'),

    path('api/candidates/', CandidateListView.as_view(), name='candidate-list'),
    path('api/candidates/activate/<int:pk>/', ActivateCandidateView.as_view(), name='activate-candidate'),
    path('api/candidates/activate/', ActivatedCanditedView.as_view(), name='activate-candidatelist'),
    path('api/candidate/count/', CandidateCountView.as_view(), name='candidate-count'),
    path('api/candidate/approved/count/', ApprovedCandidateCountView.as_view(), name='approved_candidate_count'),
    path('api/candidate/pending/count/', PendingCandidateCountView.as_view(), name='pending_candidate_count'),

    path('create-checkout-session', StripeCheckoutView.as_view()),
    
    path('stripe_webhooks/', stripewebhookview, name='stripe-webhook'),

    path('api/latest-exam-session/', LatestExamSessionView.as_view(), name='latest_exam_session'),

    path('deactivate-user/', deactivate_user, name='deactivate_user'),
    
    ]