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
- Frontend deploy: Netlify (`netlify.toml` uses `frontend` as build base)

## Project structure

```text
.
├── backend/
├── frontend/
├── netlify.toml
└── README.md
```

## Prerequisites

- Node.js 18+ (LTS recommended)
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
| `CLOUDINARY_CLOUD_NAME` | unset | Required for upload features |
| `CLOUDINARY_API_KEY` | unset | Required for upload features |
| `CLOUDINARY_API_SECRET` | unset | Required for upload features |

## Scripts

### Backend (`backend/package.json`)

- `npm run dev`: run backend with nodemon (`server.js`)

### Frontend (`frontend/package.json`)

- `npm run dev`: start Vite dev server
- `npm run build`: build production bundle
- `npm run preview`: preview production build
- `npm run lint`: run ESLint

## Deployment notes

Frontend is configured for Netlify via `netlify.toml`:

- build base: `frontend`
- build command: `npm run build`
- publish dir: `dist`
- SPA redirect: `/* -> /index.html`

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

