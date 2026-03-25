# Academy 1.618 Backend

Academy 1.618 is a full-stack online learning platform. This backend provides the REST API for authentication, course management, enrollments, payments, and admin analytics. It is built with Django, Django REST Framework, Djoser, and SimpleJWT, and is designed to work with a separately deployed React frontend.

## Live Links

- Backend API base: `https://academy-1618.vercel.app/api/v1`
- Swagger docs: `https://academy-1618.vercel.app/swagger/`
- ReDoc docs: `https://academy-1618.vercel.app/redoc/`

## Features

- JWT authentication with registration, login, logout, and account activation flow
- Custom email-based user model with student and teacher roles
- Course CRUD with teacher ownership and admin override access
- Course search, ordering, and filtering support
- Student enrollment flow with progress tracking
- Admin dashboard statistics for purchases, revenue, and top students
- Payment initiation endpoint for checkout integration
- Seed command for sample teachers, students, courses, and enrollments
- Environment-based configuration for local development and production deployment

## Tech Stack

- Python
- Django 5
- Django REST Framework
- Djoser
- SimpleJWT
- django-filter
- drf-yasg
- PostgreSQL / Supabase-ready configuration
- WhiteNoise
- django-cors-headers

## Main API Routes

- `POST /api/v1/auth/users/` - register a user
- `POST /api/v1/auth/jwt/create/` - log in and receive JWT tokens
- `POST /api/v1/auth/logout/` - blacklist refresh token
- `GET /api/v1/auth/users/me/` - fetch current user
- `GET /api/v1/courses/` - list courses
- `GET /api/v1/courses/my_courses/` - list teacher/admin courses
- `GET /api/v1/enrollments/` - list enrollments for the authenticated user
- `POST /api/v1/payments/initiate/` - start a payment flow
- `GET /api/v1/dashboard/admin/stats/` - admin analytics

## Project Structure

```text
academy/          Django settings and root URLs
api/              API root views and router configuration
users/            Custom user model, auth-related views, seed command
courses/          Course model, serializers, filters, permissions, views
enrollments/      Enrollment model, serializers, dashboard stats
payments/         Payment integration endpoints
manage.py
requirements.txt
vercel.json
```

## Local Setup

1. Create and activate a virtual environment.

```bash
python -m venv venv
venv\Scripts\activate
```

2. Install dependencies.

```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the backend root.

Example:

```env
SECRET_KEY=change-me
DEBUG=true
USE_SQLITE=true
ALLOWED_HOSTS=127.0.0.1,localhost
CSRF_TRUSTED_ORIGINS=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

4. Run migrations.

```bash
python manage.py migrate
```

5. Optional: seed sample data.

```bash
python manage.py seed_sample_data
```

6. Start the development server.

```bash
python manage.py runserver
```

## Sample Data

The project includes a seed command that creates sample teachers, students, courses, and enrollments.

Run:

```bash
python manage.py seed_sample_data
```

Default sample passwords:

- Teachers: `TeacherPass123!`
- Students: `StudentPass123!`

Example seeded teacher accounts:

- `farhan.rahman.teacher@academy1618.local`
- `nazia.sultana.teacher@academy1618.local`
- `tanvir.hossain.teacher@academy1618.local`

Example seeded student accounts:

- `amina.khan.student@academy1618.local`
- `rafi.islam.student@academy1618.local`
- `sadia.akter.student@academy1618.local`

## Environment Variables

### Core

- `SECRET_KEY`
- `DEBUG`
- `ALLOWED_HOSTS`
- `TIME_ZONE`

### Frontend / Cross-Origin

- `CORS_ALLOWED_ORIGINS`
- `CSRF_TRUSTED_ORIGINS`

### Database

- `USE_SQLITE`
- `dbname`
- `user`
- `password`
- `host`
- `port`

### Email

- `EMAIL_HOST`
- `EMAIL_USE_TLS`
- `EMAIL_PORT`
- `EMAIL_HOST_USER`
- `EMAIL_HOST_PASSWORD`

### Media / Storage

- `CLOUDINARY_URL`

## Production Notes

- Use `USE_SQLITE=false` in production
- Use a real PostgreSQL/Supabase database for persistent auth and course data
- Make sure the deployed frontend origin is listed in both `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS`
- On Vercel, set `ALLOWED_HOSTS=.vercel.app`
- After updating environment variables, redeploy the backend

## Vercel Deployment

This backend is configured for Vercel using `vercel.json`.

Recommended backend environment variables:

```env
SECRET_KEY=your-real-secret
DEBUG=false
ALLOWED_HOSTS=.vercel.app
CORS_ALLOWED_ORIGINS=https://academy-1-618.vercel.app
CSRF_TRUSTED_ORIGINS=https://academy-1-618.vercel.app
USE_SQLITE=false
dbname=your-db-name
user=your-db-user
password=your-db-password
host=your-db-host
port=your-db-port
```

After deployment, apply migrations against the production database:

```bash
python manage.py migrate
```

## Frontend Pairing

This backend is intended to work with the separate React frontend located in:

[`Academy 1.618-client`](c:/Users/FARHAN/Desktop/Academy%201.618/Academy%201.618-client/README.md)

Frontend production API base:

```env
VITE_API_BASE=https://academy-1618.vercel.app
```

## License

This project is for educational and portfolio use.
