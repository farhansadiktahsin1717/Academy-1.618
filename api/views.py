from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def api_root_view(request):
    return Response(
        {
            'auth_register': '/api/v1/auth/users/',
            'auth_login': '/api/v1/auth/jwt/create/',
            'auth_logout': '/api/v1/auth/logout/',
            'courses': '/api/v1/courses/',
            'my_courses': '/api/v1/courses/my_courses/',
            'enrollments': '/api/v1/enrollments/',
            'admin_dashboard_stats': '/api/v1/dashboard/admin/stats/',
        }
    )
