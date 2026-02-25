# Learning Management WebApp

Learning Management WebApp is a role-based LMS for **Learners**, **Instructors**, and **Admins** with course publishing, enrollment, progress tracking, and transaction monitoring.

## Core capabilities

- Learner: browse courses, buy/enroll, watch course videos, track progress, view certificates
- Instructor: create courses, upload videos/resources, review approvals, monitor earnings
- Admin: view platform stats/transactions and manage course moderation
- Auth: signup/login/logout with JWT + role checks
- Bank flow: user bank account creation and balance checks for payment-linked actions

## Architecture

- `frontend/`: React + Vite + Tailwind (SPA)
- `backend/`: Node.js + Express + MongoDB + Mongoose (REST API)
- Media storage: Cloudinary (for uploaded video/resource files)
- Deploy options:
  - Railway single-service deploy from repo root (recommended)
  - Netlify frontend + separate backend deploy

## Project structure

```text
.
├── package.json
├── backend/
├── frontend/
├── netlify.toml
└── README.md
```

## Prerequisites

- Node.js 20.19+ (required for Vite 7 build)
- npm 9+
- MongoDB instance (local or Atlas)
- Cloudinary account (needed for media upload features)

## Local setup

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Create backend env file:

```bash
cp .env.example .env
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

4. Start backend (default `http://localhost:5000`):

```bash
cd ../backend
npm run dev
```

5. Start frontend (default `http://localhost:5173`):

```bash
cd ../frontend
npm run dev
```

## Demo accounts

### Seeded by backend startup

| Role | Email | Password |
| --- | --- | --- |
| `Admin` | `admin@lms.com` | `admin123` |
| `Learner` | `learner@demo.lms` | `learner123` |
| `Instructor` | `instructor@demo.lms` | `instructor123` |

Notes:

- These defaults come from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in backend env and can be changed.
- Learner and Instructor demo accounts are auto-seeded on backend startup.
- Demo seeding can be controlled with `DEMO_USERS_ENABLED` and `DEMO_USERS_RESET_PASSWORD`.

## Environment variables (`backend/.env`)

### Required

| Key | Purpose |
| --- | --- |
| `MONGODB_URL` | MongoDB base connection URI (without DB name suffix) |
| `ACCESS_TOKEN_SECRET` | JWT secret for access tokens |
| `REFRESH_TOKEN_SECRET` | JWT secret for refresh tokens |
| `ADMIN_BANK_ACCOUNT_NUMBER` | Seeded admin bank account number |

### Optional / defaulted

| Key | Default | Notes |
| --- | --- | --- |
| `PORT` | `5000` | Backend port |
| `CLIENT_URL` | `http://localhost:5173` | Allowed frontend origin |
| `NODE_ENV` | unset | Set `production` in production |
| `ACCESS_TOKEN_EXPIRY` | `15m` | Access token expiry |
| `REFRESH_TOKEN_EXPIRY` | `7d` | Refresh token expiry |
| `ADMIN_EMAIL` | `admin@lms.com` | Seed admin email |
| `ADMIN_PASSWORD` | `admin123` | Seed admin password |
| `ADMIN_USERNAME` | `admin` | Seed admin username |
| `ADMIN_FULL_NAME` | `System Admin` | Seed admin full name |
| `ADMIN_RESET_PASSWORD` | unset | If truthy, updates existing admin credentials |
| `DEMO_USERS_ENABLED` | `true` | If falsy (`false`, `0`, `no`), skips learner/instructor demo seeding |
| `DEMO_USERS_RESET_PASSWORD` | unset | If truthy, updates existing demo learner/instructor credentials |
| `DEMO_LEARNER_EMAIL` | `learner@demo.lms` | Demo learner login email |
| `DEMO_LEARNER_PASSWORD` | `learner123` | Demo learner login password |
| `DEMO_LEARNER_USERNAME` | `demo_learner` | Demo learner username |
| `DEMO_LEARNER_FULL_NAME` | `Demo Learner` | Demo learner display name |
| `DEMO_LEARNER_BANK_ACCOUNT_NUMBER` | `2022331090` | Bank account linked to demo learner |
| `DEMO_INSTRUCTOR_EMAIL` | `instructor@demo.lms` | Demo instructor login email |
| `DEMO_INSTRUCTOR_PASSWORD` | `instructor123` | Demo instructor login password |
| `DEMO_INSTRUCTOR_USERNAME` | `demo_instructor` | Demo instructor username |
| `DEMO_INSTRUCTOR_FULL_NAME` | `Demo Instructor` | Demo instructor display name |
| `DEMO_INSTRUCTOR_BANK_ACCOUNT_NUMBER` | `2022331091` | Bank account linked to demo instructor |
| `CLOUDINARY_CLOUD_NAME` | unset | Required for upload features |
| `CLOUDINARY_API_KEY` | unset | Required for upload features |
| `CLOUDINARY_API_SECRET` | unset | Required for upload features |

## Scripts

### Backend (`backend/package.json`)

- `npm run dev`: run backend with nodemon (`server.js`)
- `npm run start`: run backend in production (`server.js`)

### Frontend (`frontend/package.json`)

- `npm run dev`: start Vite dev server
- `npm run build`: build production bundle
- `npm run preview`: preview production build
- `npm run lint`: run ESLint

### Root (`package.json`)

- `npm run build`: install backend + frontend dependencies, then build frontend
- `npm run start`: start backend (Railway process command)
- `npm run dev:backend`: run backend in dev mode
- `npm run dev:frontend`: run frontend in dev mode

## Railway deployment (single service)

This repo is configured so Railway can deploy from the repository root:

- Build command: `npm run build`
- Start command: `npm run start`
- Port: Railway-provided `PORT` is used automatically
- Health check endpoint: `/api/health`

### Railway environment variables

Set these in Railway:

- `NODE_ENV=production`
- `MONGODB_URL`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `ADMIN_BANK_ACCOUNT_NUMBER`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Notes:

- `CLIENT_URL` is optional for single-service Railway deploys (Railway domain is auto-allowed).
- Frontend defaults to same-origin `/api` when `VITE_API_BASE_URL` is not set.

Note: this project uses cookie-based auth with `withCredentials`, so backend must be HTTPS in production.

## Netlify + separate backend (alternative)

Frontend is configured for Netlify via `netlify.toml`:

- build base: `frontend`
- build command: `npm run build`
- publish dir: `dist`
- SPA redirect: `/* -> /index.html`

For this setup:

1. Deploy backend separately.
2. Set backend `CLIENT_URL=https://your-netlify-site.netlify.app` (or comma-separated list for preview URLs).
3. Set Netlify env `VITE_API_BASE_URL=https://your-backend-domain.com`.

## API notes

API request examples are available in:

- `backend/POSTMAN_COLLECTION.md`

## GitHub repository metadata

Set repo description:

`Learning Management WebApp for learners, instructors, and admins with course publishing, enrollment, and progress tracking.`

Recommended topics:

- `learning-management-system`
- `mern`
- `react`
- `express`
- `mongodb`
- `edtech`
- `role-based-access-control`

### CLI (`gh`) example

```bash
gh repo edit crakindee2k-a11y/learning-management-webapp \
  --description "Learning Management WebApp for learners, instructors, and admins with course publishing, enrollment, and progress tracking." \
  --add-topic learning-management-system \
  --add-topic mern \
  --add-topic react \
  --add-topic express \
  --add-topic mongodb \
  --add-topic edtech \
  --add-topic role-based-access-control
```

### GitHub UI path

- Open repository on GitHub
- `Settings` -> `General` -> edit **Description**
- In the right sidebar, edit **About** -> **Topics**
