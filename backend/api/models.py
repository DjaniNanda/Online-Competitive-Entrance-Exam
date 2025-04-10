from django.db import models
from django.contrib.auth.models import AbstractUser , Group
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from autoslug import AutoSlugField 

def candidate_directory_path(instance, filename):
    return f'documents/{instance.fullname}/{filename}'

class User(AbstractUser):
   
    username = models.CharField(max_length=100)
    email    = models.EmailField(unique=True)
    is_active= models.BooleanField(default=True)
    fullname = models.CharField(max_length=255,null=True)
    gender   = models.IntegerField(choices=[(1, 'm'), (0, 'f')],null=True)
    dob      = models.DateField(null=True)
    cni      = models.FileField(upload_to=candidate_directory_path,null=True )
    image    = models.ImageField(upload_to=candidate_directory_path,null=True)
    require_diploma  = models.FileField(upload_to=candidate_directory_path,null=True)
    birth_certificate = models.FileField(upload_to=candidate_directory_path,null=True)
    groups = models.ManyToManyField('auth.Group', related_name='custom_users', blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
#for mcq questions
class Subject(models.Model):
    title = models.CharField( _("Subject Title"), max_length=255, unique=True, default=_("New Subject"))
    created_at = models.DateTimeField(auto_now_add=True)
    duration = models.DurationField(_("Duration"), null=True, blank=True)
    @property
    def question_count(self):
        return self.questions.count()

    class Meta:
        verbose_name = _("Subject")
        verbose_name_plural = _("Subjects")
        ordering = ["id"]

    def __str__(self):
        return self.title
    
class ExamSession(models.Model):
    name = models.CharField(max_length=100)
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    start_time = models.TimeField(null=True)
    end_time = models.TimeField(null=True)
    class Meta:
        verbose_name = _("ExamSession")
        verbose_name_plural = _("ExamSessions")
        


class Question(models.Model):
    
    exam_session = models.ForeignKey(ExamSession, related_name="questions",null=True, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, related_name="questions",null=True, on_delete=models.CASCADE)

    title = models.CharField(max_length=255, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Question")
        verbose_name_plural = _("Questions")
        

    def __str__(self):
        return self.title


class Answer(models.Model):
    question = models.ForeignKey( Question, related_name="answers", on_delete=models.CASCADE)
    answer_text = models.CharField(max_length=255, null=True, blank=True)
    is_right = models.BooleanField(default=False, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Answer")
        verbose_name_plural = _("Answers")
        ordering = ["id"]

    def __str__(self):
        return self.answer_text if self.answer_text else "No answer text"
    
class UserAnswer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_answer = models.ForeignKey(Answer, on_delete=models.CASCADE)
   

    def is_correct(self):
        return self.selected_answer.is_right
    
class Result(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Link to User
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)  # Link to Subject
    score = models.FloatField()
    date = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Result")
        verbose_name_plural = _("Results")
        ordering = ["-score"]  # Order by marks descending

    def __str__(self):
        return f"{self.user.email} :{self.score}"


class PaymentHistory(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    payment_status=models.BooleanField()


    def __int__(self):
        return self.user