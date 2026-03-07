from django.conf import settings
from django.db import models

from courses.models import Course


class Enrollment(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='enrollments',
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='enrollments',
    )
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    progress = models.PositiveSmallIntegerField(default=0)
    purchased_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-purchased_at']
        constraints = [
            models.UniqueConstraint(fields=['student', 'course'], name='unique_student_course_enrollment'),
        ]

    def __str__(self):
        return f'{self.student.email} -> {self.course.title}'
