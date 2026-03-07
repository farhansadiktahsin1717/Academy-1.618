from django_filters import rest_framework as filters

from courses.models import Course


class CourseFilter(filters.FilterSet):
    department = filters.CharFilter(field_name='department', lookup_expr='iexact')
    min_price = filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = filters.NumberFilter(field_name='price', lookup_expr='lte')

    class Meta:
        model = Course
        fields = ['department', 'min_price', 'max_price']
