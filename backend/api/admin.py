from django.contrib import admin
from .models import *
from django.contrib.auth import get_user_model

User = get_user_model()

class UserAdmin(admin.ModelAdmin):
   list_editable = ['is_active']
   list_display = ['username','is_active']



class SubjectAdmin(admin.ModelAdmin):
    list_display = ["id", "title"]


class AnswerInlineModel(admin.TabularInline):
    model = Answer

    fields = ["answer_text", "is_right"]

class QuestionAdmin(admin.ModelAdmin):
    fields = ["title", "subject","exam_session"]

    list_display = ["title", "id","subject", "created_at","exam_session"]

    inlines = [AnswerInlineModel]

class AnswerAdmin(admin.ModelAdmin):

    list_display = ["answer_text", "is_right", "question","id"]

class ResultAdmin(admin.ModelAdmin):
    model = Result
    list_display = ['id', 'user', 'subject', 'score', 'date']

class QuestionInlineModel(admin.TabularInline):
    model = Question
    extra = 1

    
class ExamSessionAdmin(admin.ModelAdmin):
    model = ExamSession
    list_display = [ 'name','id']
    inlines = [QuestionInlineModel]

class UserAnswerAdmin(admin.ModelAdmin):
    model = UserAnswer
    list_display = [ 'user', ]

class paymentHistoryAdmin(admin.ModelAdmin):
    model = PaymentHistory
    list_display = [ 'user' ]

admin.site.register(Subject, SubjectAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Answer, AnswerAdmin)
admin.site.register(User,UserAdmin)
admin.site.register(PaymentHistory,paymentHistoryAdmin)
admin.site.register(Result,ResultAdmin)
admin.site.register(ExamSession,ExamSessionAdmin)
admin.site.register(UserAnswer,UserAnswerAdmin)

# Register your models here.
