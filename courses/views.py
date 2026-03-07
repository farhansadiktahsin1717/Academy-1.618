from rest_framework import decorators, permissions, response, status, viewsets

from courses.filters import CourseFilter
from courses.models import Course
from courses.permissions import IsTeacherOrAdminForWrite
from courses.serializers import CourseSerializer


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.select_related('teacher').all()
    permission_classes = [IsTeacherOrAdminForWrite]
    filterset_class = CourseFilter
    search_fields = ['title', 'description', 'department']
    ordering_fields = ['created_at', 'price', 'title']

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

    @decorators.action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_courses(self, request):
        if not (request.user.is_teacher or request.user.is_staff):
            return response.Response(
                {'detail': 'Only teachers and admins can view my courses.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        queryset = self.get_queryset()
        if not request.user.is_staff:
            queryset = queryset.filter(teacher=request.user)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return response.Response(serializer.data)
