# Academy 1.618 Frontend

Academy 1.618 is the React frontend for a full-stack online learning platform. It provides a responsive landing page, public course discovery experience, authentication UI, checkout flow, and role-aware dashboard screens for students, teachers, and admins.

## Live Link

- Frontend live site: `https://academy-1-618.vercel.app/`

## Related Backend

- Backend API base: `https://academy-1618.vercel.app/api/v1`
- Swagger docs: `https://academy-1618.vercel.app/swagger/`

## Features

- Multi-page marketing site with Home, About, Contact, and 404 pages
- Responsive navigation with active links and mobile hamburger menu
- Dark mode toggle
- Course catalog with live backend data
- Search and sorting for course discovery
- Login and registration UI
- JWT-based authentication flow with token persistence
- Checkout UI connected to the payment initiation endpoint
- Student, teacher, and admin dashboard views
- Skeleton loading states
- PWA support with manifest and service worker

## Tech Stack

- React 18
- Vite
- React Router
- CSS
- PropTypes

## Project Structure

```text
src/
  components/     Shared UI components and layout
  pages/          Route-level screens
  App.jsx         App state, routing, API integration
  App.css         Main component styling
  index.css       Global design system variables and base styles
public/
  manifest.webmanifest
  sw.js
```

## Local Setup

1. Install dependencies.

```bash
npm install
```

2. Create your environment file.

Example `.env.local`:

```env
VITE_API_BASE=http://localhost:8000/api/v1
```

3. Start the development server.

```bash
npm run dev
```

4. Open the app in the browser.

```text
http://localhost:5173
```

## Available Scripts

- `npm run dev` - start local dev server
- `npm run build` - create production build
- `npm run preview` - preview production build locally
- `npm run lint` - run ESLint

## Environment Variables

### Required

- `VITE_API_BASE`

Recommended production value:

```env
VITE_API_BASE=https://academy-1618.vercel.app
```

The frontend normalizes this value automatically, so either of these work:

```env
VITE_API_BASE=https://academy-1618.vercel.app
VITE_API_BASE=https://academy-1618.vercel.app/api/v1
```

## Production Notes

- This frontend is deployed separately from the backend
- `VITE_API_BASE` must point to the backend project, not the frontend domain
- After changing environment variables in Vercel, redeploy the frontend
- If a stale deployed build appears, clear the browser service worker and site storage

## Vercel Deployment

This frontend is configured for Vercel as a Vite app.

Recommended frontend environment variable:

```env
VITE_API_BASE=https://academy-1618.vercel.app
```

Deployment notes:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

## Login and API Integration

The frontend communicates with the Django backend for:

- course loading
- JWT login
- user profile loading
- enrollment data
- admin dashboard stats
- payment initiation

Example production auth endpoint:

```text
https://academy-1618.vercel.app/api/v1/auth/jwt/create/
```

## Design Highlights

- Clean and minimal UI direction
- Consistent spacing, buttons, and typography
- Mobile-friendly layout
- Shared shell across public pages and dashboard routes
- Dark mode and installable PWA support for extra polish

## Backend Repository Context

The frontend is paired with the Django backend in the repository root:

[`README.md`](c:/Users/FARHAN/Desktop/Academy%201.618/README.md)

## License

This project is for educational and portfolio use.
