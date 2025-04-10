from .models import *
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer 
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.models import User, Group
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username', 'image','fullname','email','require_diploma','birth_certificate','cni','is_active']

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # Call the parent method to get the token
        token = super().get_token(user)

        token['id'] = user.id

        token['username'] = user.username
        # Add custom claims
        token['email'] = user.email
        
        # Add user groups
        token['groups'] = [group.name for group in user.groups.all()]

        return token


        

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)


    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'fullname', 'gender', 'dob', 'image', 'cni', 'require_diploma', 'birth_certificate', 'groups')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    
    def create(self, validated_data):
        groups_data = validated_data.pop('groups', None)
        
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            fullname=validated_data['fullname'],
            gender=validated_data['gender'],
            dob=validated_data['dob'],
            image=validated_data['image'],
            cni=validated_data['cni'],
            require_diploma=validated_data['require_diploma'],
            birth_certificate=validated_data['birth_certificate'],
        )
        
        user.set_password(validated_data['password'])  # Hash the password
        user.save()

        # Assign groups if provided
        if groups_data:
            for group_name in groups_data:
                group = Group.objects.get(name=group_name)
                user.groups.add(group)

        return user

    
class SubjectSerializer(serializers.ModelSerializer):
    question_count = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = ["id","title","created_at","question_count","duration"] 

    def validate(self, data):
        if not data.get('title'):
            raise serializers.ValidationError("Title is required.")
        if Subject.objects.filter(title=data['title']).exists():
            raise serializers.ValidationError("This title already exists.")
        return data

    def get_question_count(self, obj):
        return obj.questions.count() 
           
class AnswerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Answer
        fields = [
            "id",
            "answer_text",
            "is_right"
        ]


class PaymentHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentHistory
        fields =['id','payement_status','email']


class ExamSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamSession
        fields =['id','name','start_date','end_date','start_time','end_time']

    def validate(self, attrs):
        # Validate that the start date is before the end date
        if attrs['start_date'] > attrs['end_date']:
            raise serializers.ValidationError("Start date must be before end date.")
        return attrs  # Return the validated attributes

    def to_representation(self, instance):
        """Convert the instance to a dictionary for output."""
        representation = super().to_representation(instance)
        # You can modify the representation if needed
        return representation

class QuestionSerializer(serializers.ModelSerializer):
    exam_session = ExamSessionSerializer( read_only=True)
    subject = SubjectSerializer(read_only=True)
    answers = AnswerSerializer(many=True)
  
    class Meta:
        model = Question
        fields = ["id", "exam_session", "subject", "title", "answers"]

    def create(self, validated_data):
        answers_data = validated_data.pop("answers")  # Extract answers data

    # Create the Question instance
        question = Question.objects.create(
        exam_session=validated_data.pop("exam_session"),
        subject=validated_data.pop("subject"),
        **validated_data
        )

    # Create the related Answer instances
        for answer_data in answers_data:
         Answer.objects.create(question=question, **answer_data)

        return question

    def update(self, instance, validated_data):
        # Update the title
        instance.title = validated_data.get("title", instance.title)

        # Update the subject if needed
        subject_data = validated_data.get("subject")
        if subject_data:
            subject, _ = Subject.objects.get_or_create(title=subject_data['title'])  # Handle subject creation
            instance.subject = subject
        instance.save()

        # Handle answers
        answers_data = validated_data.pop("answers", [])
        existing_answers = {answer.id: answer for answer in instance.answers.all()}

        for answer_data in answers_data:
            answer_id = answer_data.get('id')
            if answer_id and answer_id in existing_answers:
                # Update existing answer
                existing_answer = existing_answers[answer_id]
                for attr, value in answer_data.items():
                    setattr(existing_answer, attr, value)
                existing_answer.save()
            else:
                # Create new answer
                Answer.objects.create(question=instance, **answer_data)

        return instance


class UserAnswerSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(read_only=True)
    selected_choice = AnswerSerializer(read_only=True)

    class Meta:
        model = UserAnswer
        fields = ['id', 'user', 'question', 'selected_choice']

class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = '__all__'

class ExamSessionDetailSerializer(serializers.ModelSerializer):
    subjects = serializers.SerializerMethodField()
    users = serializers.SerializerMethodField()
    user_scores = serializers.SerializerMethodField()
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = ExamSession
        fields = ['id', 'name', 'start_date', 'end_date', 'subjects', 'users', 'user_scores', 'questions']

    def get_subjects(self, obj):
        subjects = Subject.objects.filter(questions__exam_session=obj).distinct()
        return SubjectSerializer(subjects, many=True).data

    def get_users(self, obj):
        users = User.objects.filter(result__exam_session=obj).distinct()
        return UserSerializer(users, many=True).data

    def get_user_scores(self, obj):
        results = Result.objects.filter(exam_session=obj)
        return [{"user": result.user.username, "score": result.score} for result in results]
    