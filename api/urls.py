from django.urls import include, path
from rest_framework_nested import routers

from enrollments.views import AdminDashboardStatsView, EnrollmentViewSet
from courses.views import CourseViewSet
from users.views import LogoutView

router = routers.DefaultRouter()
router.register('courses', CourseViewSet, basename='courses')
router.register('enrollments', EnrollmentViewSet, basename='enrollments')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/admin/stats/', AdminDashboardStatsView.as_view(), name='admin-dashboard-stats'),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
]
