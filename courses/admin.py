from django.contrib import admin

from courses.models import Course


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'department', 'price', 'teacher', 'created_at')
    list_filter = ('department',)
    search_fields = ('title', 'department', 'teacher__email')
