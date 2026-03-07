from datetime import timedelta

from django.db.models import Count, Sum
from django.db.models.functions import Coalesce
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from enrollments.models import Enrollment
from enrollments.serializers import EnrollCourseSerializer, EnrollmentSerializer, ProgressUpdateSerializer


class EnrollmentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Enrollment.objects.select_related('course', 'student').all()

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        if user.is_staff:
            return queryset
        return queryset.filter(student=user)

    def get_serializer_class(self):
        if self.action == 'create':
            return EnrollCourseSerializer
        if self.action in ['partial_update', 'update']:
            return ProgressUpdateSerializer
        return EnrollmentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        enrollment = serializer.save()
        output = EnrollmentSerializer(enrollment, context=self.get_serializer_context())
        return Response(output.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        enrollment = self.get_object()
        if not (request.user.is_staff or enrollment.student_id == request.user.id):
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(enrollment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(EnrollmentSerializer(enrollment).data)


class AdminDashboardStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        now = timezone.now()
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)

        purchases_last_week = Enrollment.objects.filter(purchased_at__gte=week_ago).count()
        purchases_last_month = Enrollment.objects.filter(purchased_at__gte=month_ago).count()

        mostly_purchased_courses = list(
            Enrollment.objects.values('course__id', 'course__title')
            .annotate(total_purchases=Count('id'))
            .order_by('-total_purchases')[:5]
        )

        top_students = list(
            Enrollment.objects.values('student__id', 'student__email')
            .annotate(
                courses_bought=Count('id'),
                total_spent=Coalesce(Sum('amount_paid'), 0),
            )
            .order_by('-courses_bought', '-total_spent')[:5]
        )

        current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        previous_month_end = current_month_start - timedelta(microseconds=1)
        previous_month_start = previous_month_end.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        total_sell_current_month = (
            Enrollment.objects.filter(purchased_at__gte=current_month_start).aggregate(
                total=Coalesce(Sum('amount_paid'), 0)
            )['total']
        )
        total_sell_previous_month = (
            Enrollment.objects.filter(
                purchased_at__gte=previous_month_start,
                purchased_at__lte=previous_month_end,
            ).aggregate(total=Coalesce(Sum('amount_paid'), 0))['total']
        )

        return Response(
            {
                'purchases_last_week': purchases_last_week,
                'purchases_last_month': purchases_last_month,
                'mostly_purchased_courses': mostly_purchased_courses,
                'top_5_students': top_students,
                'total_sell_current_month': total_sell_current_month,
                'total_sell_previous_month': total_sell_previous_month,
            }
        )
