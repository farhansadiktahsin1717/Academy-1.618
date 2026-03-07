from rest_framework import serializers

from enrollments.models import Enrollment
from courses.models import Course


class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    student_email = serializers.CharField(source='student.email', read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            'id',
            'student',
            'student_email',
            'course',
            'course_title',
            'amount_paid',
            'progress',
            'purchased_at',
        ]
        read_only_fields = ['student', 'student_email', 'amount_paid', 'purchased_at']


class EnrollCourseSerializer(serializers.Serializer):
    course_id = serializers.IntegerField()

    def validate_course_id(self, value):
        if not Course.objects.filter(id=value).exists():
            raise serializers.ValidationError('Course does not exist.')
        return value

    def create(self, validated_data):
        user = self.context['request'].user
        course = Course.objects.get(id=validated_data['course_id'])

        if Enrollment.objects.filter(student=user, course=course).exists():
            raise serializers.ValidationError('You are already enrolled in this course.')

        return Enrollment.objects.create(
            student=user,
            course=course,
            amount_paid=course.price,
        )


class ProgressUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['progress']

    def validate_progress(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError('Progress must be between 0 and 100.')
        return value
