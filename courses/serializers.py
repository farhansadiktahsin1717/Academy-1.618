from rest_framework import serializers

from courses.models import Course


class CourseSerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField(read_only=True)
    enrolled = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Course
        fields = [
            'id',
            'title',
            'description',
            'department',
            'price',
            'teacher',
            'teacher_name',
            'modules',
            'resources',
            'quiz_overview',
            'enrolled',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['teacher', 'teacher_name', 'enrolled', 'created_at', 'updated_at']

    def get_teacher_name(self, obj):
        return obj.teacher.get_full_name() or obj.teacher.email

    def get_enrolled(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        if request.user.is_staff:
            return True
        return obj.enrollments.filter(student_id=request.user.id).exists()
