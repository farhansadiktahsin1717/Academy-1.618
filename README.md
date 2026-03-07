# Academy 1.618 - Online School API

Django REST API for an e-learning platform where students register, verify email, buy courses, and track progress. Teachers manage their own courses, while admins access platform analytics.

## Implemented Requirements

1. User Registration and Authentication
- Registration: `POST /api/v1/auth/users/`
- Email activation (Djoser): activation link sent after registration
- Login (JWT): `POST /api/v1/auth/jwt/create/`
- Logout (blacklist refresh token): `POST /api/v1/auth/logout/`

2. Course Creation
- Teachers and admins can create courses: `POST /api/v1/courses/`
- Course fields: `title`, `description`, `department`, `price`, `modules`, `resources`, `quiz_overview`

3. Course Management
- Teacher can update/delete only their own courses
- Admin can update/delete any course
- Teacher dashboard list: `GET /api/v1/courses/my_courses/`

4. Course Listings
- Home listing: `GET /api/v1/courses/`
- Filter by department: `GET /api/v1/courses/?department=CSE`
- Search: `?search=python`
- Ordering: `?ordering=price` or `?ordering=-created_at`

5. Admin Dashboard
- Endpoint: `GET /api/v1/dashboard/admin/stats/` (admin only)
- Returns:
  - purchases in last week and last month
  - mostly purchased courses
  - top 5 students by course purchases
  - total sales for current month and previous month

6. Deployment Ready (Django REST API)
- Built for standard Django deployment targets (Render/Railway/EC2/Vercel serverless adapter patterns)
- Uses environment-based settings
- PostgreSQL can be enabled with `USE_POSTGRES=true`

## Tech Stack
- Django 5
- Django REST Framework
- Djoser + SimpleJWT
- django-filter
- drf-yasg (Swagger / ReDoc)

## Local Setup

1. Install dependencies
```bash
pip install -r requirements.txt
```

2. Run migrations
```bash
python manage.py migrate
```

3. Create admin
```bash
python manage.py createsuperuser
```

4. Run server
```bash
python manage.py runserver
```

## Environment Variables

Optional (safe defaults exist for local development):
- `SECRET_KEY`
- `DEBUG`
- `ALLOWED_HOSTS`
- `TIME_ZONE`

Email (for real activation emails):
- `EMAIL_HOST`
- `EMAIL_USE_TLS`
- `EMAIL_PORT`
- `EMAIL_HOST_USER`
- `EMAIL_HOST_PASSWORD`

PostgreSQL:
- `USE_POSTGRES=true`
- `dbname`
- `user`
- `password`
- `host`
- `port`

If email host is not configured, activation links are printed to console backend.

## API Documentation
- Swagger: `/swagger/`
- ReDoc: `/redoc/`

## Vercel Deployment

This project includes `vercel.json` and is ready for Django serverless deployment on Vercel.

1. Vercel project settings
- Framework preset: `Other`
- Root directory: repository root (where `manage.py` exists)

2. Required environment variables on Vercel
- `SECRET_KEY` (required, set a strong value)
- `DEBUG=false`
- `ALLOWED_HOSTS=.vercel.app`
- `CSRF_TRUSTED_ORIGINS=https://<your-project>.vercel.app`
- `USE_POSTGRES=true`
- `dbname`
- `user`
- `password`
- `host`
- `port`
- `CLOUDINARY_URL` (required for persistent media storage)

3. Optional variables
- `TIME_ZONE`
- Email settings (`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `EMAIL_USE_TLS`)

4. Deploy with Vercel CLI
```bash
vercel
vercel --prod
```

5. Apply database migrations (from local machine using production env vars)
```bash
python manage.py migrate
```

Notes:
- Local SQLite files are excluded from deployment via `.vercelignore`.
- Vercel filesystem is ephemeral; production now enforces Cloudinary-backed media storage.
