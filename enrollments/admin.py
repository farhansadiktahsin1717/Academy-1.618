from django.contrib import admin

from enrollments.models import Enrollment


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'course', 'amount_paid', 'progress', 'purchased_at')
    list_filter = ('course__department', 'purchased_at')
    search_fields = ('student__email', 'course__title')
