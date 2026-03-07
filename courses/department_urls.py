from django.urls import path

from courses.views import CourseViewSet

department_courses = CourseViewSet.as_view({'get': 'list'})

urlpatterns = [
    path('', department_courses, name='department-course-list'),
]
