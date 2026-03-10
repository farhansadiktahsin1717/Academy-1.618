from rest_framework import serializers

from courses.models import Course


class PaymentInitiateSerializer(serializers.Serializer):
    course_id = serializers.IntegerField()
    customer_name = serializers.CharField(max_length=120)
    customer_phone = serializers.CharField(max_length=20)
    customer_address = serializers.CharField()

    def validate_course_id(self, value):
        if not Course.objects.filter(id=value).exists():
            raise serializers.ValidationError('Course does not exist.')
        return value
