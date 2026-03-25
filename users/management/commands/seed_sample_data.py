from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from courses.models import Course
from enrollments.models import Enrollment


User = get_user_model()


TEACHERS = [
    {
        'email': 'farhan.rahman.teacher@academy1618.local',
        'first_name': 'Farhan',
        'last_name': 'Rahman',
        'role': 'teacher',
        'password': 'TeacherPass123!',
    },
    {
        'email': 'nazia.sultana.teacher@academy1618.local',
        'first_name': 'Nazia',
        'last_name': 'Sultana',
        'role': 'teacher',
        'password': 'TeacherPass123!',
    },
    {
        'email': 'tanvir.hossain.teacher@academy1618.local',
        'first_name': 'Tanvir',
        'last_name': 'Hossain',
        'role': 'teacher',
        'password': 'TeacherPass123!',
    },
]

STUDENTS = [
    {
        'email': 'amina.khan.student@academy1618.local',
        'first_name': 'Amina',
        'last_name': 'Khan',
        'role': 'student',
        'password': 'StudentPass123!',
    },
    {
        'email': 'rafi.islam.student@academy1618.local',
        'first_name': 'Rafi',
        'last_name': 'Islam',
        'role': 'student',
        'password': 'StudentPass123!',
    },
    {
        'email': 'sadia.akter.student@academy1618.local',
        'first_name': 'Sadia',
        'last_name': 'Akter',
        'role': 'student',
        'password': 'StudentPass123!',
    },
    {
        'email': 'mehedi.hasan.student@academy1618.local',
        'first_name': 'Mehedi',
        'last_name': 'Hasan',
        'role': 'student',
        'password': 'StudentPass123!',
    },
    {
        'email': 'nusrat.jahan.student@academy1618.local',
        'first_name': 'Nusrat',
        'last_name': 'Jahan',
        'role': 'student',
        'password': 'StudentPass123!',
    },
]

COURSES = [
    {
        'title': 'Modern React Foundations',
        'description': 'Build confident frontend skills with components, routing, forms, and polished UI patterns.',
        'department': 'Frontend',
        'price': Decimal('3500.00'),
        'teacher_email': 'farhan.rahman.teacher@academy1618.local',
        'modules': ['React basics', 'Routing', 'State management', 'Reusable UI systems'],
        'resources': ['Slides', 'Component exercises', 'Starter templates'],
        'quiz_overview': 'Weekly quizzes plus one mini project review.',
    },
    {
        'title': 'Advanced Django API Engineering',
        'description': 'Design scalable Django REST APIs with auth, filtering, permissions, and production-ready patterns.',
        'department': 'Backend',
        'price': Decimal('4200.00'),
        'teacher_email': 'farhan.rahman.teacher@academy1618.local',
        'modules': ['DRF foundations', 'JWT auth', 'Permissions', 'Deployment'],
        'resources': ['API design workbook', 'Endpoint checklist'],
        'quiz_overview': 'Three assessments and one capstone API build.',
    },
    {
        'title': 'UI Systems and Product Design',
        'description': 'Create cleaner interfaces with layout systems, hierarchy, accessibility, and visual consistency.',
        'department': 'Design',
        'price': Decimal('3100.00'),
        'teacher_email': 'nazia.sultana.teacher@academy1618.local',
        'modules': ['Design principles', 'Typography', 'Design systems', 'Prototype reviews'],
        'resources': ['Figma files', 'Design critique templates'],
        'quiz_overview': 'Short critiques and one portfolio redesign.',
    },
    {
        'title': 'Data Analytics for Decision Making',
        'description': 'Use spreadsheets, SQL, and dashboards to turn raw data into clear product insights.',
        'department': 'Data',
        'price': Decimal('2800.00'),
        'teacher_email': 'tanvir.hossain.teacher@academy1618.local',
        'modules': ['SQL basics', 'Data cleaning', 'Dashboards', 'Business storytelling'],
        'resources': ['Datasets', 'Dashboard templates'],
        'quiz_overview': 'Hands-on data tasks every week.',
    },
    {
        'title': 'Python for Problem Solving',
        'description': 'Learn practical Python for automation, logic building, and backend preparation.',
        'department': 'Programming',
        'price': Decimal('2600.00'),
        'teacher_email': 'tanvir.hossain.teacher@academy1618.local',
        'modules': ['Python basics', 'Functions', 'Data structures', 'Scripts'],
        'resources': ['Code labs', 'Practice sheets'],
        'quiz_overview': 'Code challenges and one automation assignment.',
    },
]

ENROLLMENTS = [
    ('amina.khan.student@academy1618.local', 'Modern React Foundations', 24),
    ('amina.khan.student@academy1618.local', 'UI Systems and Product Design', 48),
    ('rafi.islam.student@academy1618.local', 'Advanced Django API Engineering', 15),
    ('rafi.islam.student@academy1618.local', 'Python for Problem Solving', 55),
    ('sadia.akter.student@academy1618.local', 'Data Analytics for Decision Making', 39),
    ('sadia.akter.student@academy1618.local', 'Modern React Foundations', 61),
    ('mehedi.hasan.student@academy1618.local', 'Advanced Django API Engineering', 72),
    ('mehedi.hasan.student@academy1618.local', 'Data Analytics for Decision Making', 18),
    ('nusrat.jahan.student@academy1618.local', 'UI Systems and Product Design', 80),
    ('nusrat.jahan.student@academy1618.local', 'Python for Problem Solving', 33),
]


class Command(BaseCommand):
    help = 'Seed sample teachers, students, courses, and enrollments for Academy 1.618.'

    def handle(self, *args, **options):
        teachers = {}
        students = {}

        for payload in TEACHERS + STUDENTS:
            user, created = User.objects.get_or_create(
                email=payload['email'],
                defaults={
                    'first_name': payload['first_name'],
                    'last_name': payload['last_name'],
                    'role': payload['role'],
                    'is_active': True,
                },
            )
            user.first_name = payload['first_name']
            user.last_name = payload['last_name']
            user.role = payload['role']
            user.is_active = True
            user.set_password(payload['password'])
            user.save()

            collection = teachers if payload['role'] == 'teacher' else students
            collection[user.email] = user

            verb = 'Created' if created else 'Updated'
            self.stdout.write(f'{verb} user: {user.email}')

        courses = {}
        for payload in COURSES:
            teacher = teachers[payload['teacher_email']]
            course, created = Course.objects.update_or_create(
                title=payload['title'],
                defaults={
                    'description': payload['description'],
                    'department': payload['department'],
                    'price': payload['price'],
                    'teacher': teacher,
                    'modules': payload['modules'],
                    'resources': payload['resources'],
                    'quiz_overview': payload['quiz_overview'],
                },
            )
            courses[course.title] = course
            verb = 'Created' if created else 'Updated'
            self.stdout.write(f'{verb} course: {course.title} -> {teacher.email}')

        for student_email, course_title, progress in ENROLLMENTS:
            student = students[student_email]
            course = courses[course_title]
            enrollment, created = Enrollment.objects.update_or_create(
                student=student,
                course=course,
                defaults={
                    'amount_paid': course.price,
                    'progress': progress,
                },
            )
            verb = 'Created' if created else 'Updated'
            self.stdout.write(f'{verb} enrollment: {student.email} -> {course.title} ({enrollment.progress}%)')

        self.stdout.write(self.style.SUCCESS('Sample academy data is ready.'))
        self.stdout.write('Teacher password: TeacherPass123!')
        self.stdout.write('Student password: StudentPass123!')
