# BugLogger

BugLogger is a full-stack issue tracking application for software teams. It gives a team one workspace to report bugs, assign ownership, follow progress, discuss issues, and monitor the health of the project from a dashboard.

The application is built as a React frontend backed by an Express and MySQL API. Authenticated requests use JWT tokens, while passwords and password-reset OTPs are protected with bcrypt.

## What It Does

- Registers users against an organization and supports email/password login.
- Supports Google sign-in when Google OAuth credentials are configured.
- Creates and manages teams inside an organization.
- Invites team members through email invitation links.
- Creates, views, edits, assigns, and deletes bugs.
- Tracks bug status through open, in-progress, resolved, and closed states.
- Adds comments and supports media attachments on bug discussions.
- Records and displays bug activity history.
- Provides dashboard statistics, recent bugs, and bugs assigned to the current user.
- Supports forgot-password, OTP verification, and password reset flows.
- Allows users to edit their profile and change their password from the account pages.

## Main User Flow

1. A user registers with a name, email, password, and existing organization.
2. The user signs in and receives a JWT session token.
3. The user selects or creates a team and can invite teammates.
4. Team members create bugs with details and attachments, assign them to users, and update their status.
5. Team members collaborate through comments and use the dashboard to see current progress.

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- Axios
- Lucide React and React Icons

### Backend

- Node.js
- Express 5
- MySQL with mysql2
- JWT authentication
- bcrypt password hashing
- Nodemailer for password-reset emails
- Multer for uploaded media
- Cloudinary for media storage
- Google Auth Library for Google sign-in

## Project Structure

```text
BugLogger/
├── backend/
│   └── src/
│       ├── controllers/   Request and business logic
│       ├── middleware/    JWT and team authorization
│       ├── routes/        API route definitions
│       ├── services/      Email, uploads, and Cloudinary services
│       ├── config/        Database connection
│       └── server.js      Backend entry point
└── frontend/
	└── src/
		├── pages/         Login, dashboard, bugs, team, profile, and settings
		├── components/    Reusable UI and bug workflow components
		├── api/            Axios API modules
		└── App.jsx        Client-side routes
```

## API Overview

All protected endpoints require an `Authorization: Bearer <token>` header. Team-scoped endpoints also use the `x-team-id` header.

| Area | Endpoints |
| --- | --- |
| Authentication | `POST /api/auth/login`, `POST /api/auth/google` |
| Password recovery | `POST /api/auth/forgot-password`, `POST /api/auth/verify-otp`, `POST /api/auth/reset-password` |
| Users | `POST /api/users`, `GET /api/users/me`, `PUT /api/users/me`, `PUT /api/users/me/password` |
| Organizations | `POST /api/organizations` |
| Dashboard | `GET /api/dashboard/stats`, `GET /api/dashboard/recent`, `GET /api/dashboard/assigned` |
| Teams | `GET /api/team`, `POST /api/team`, `GET /api/team/members`, `POST /api/team/invite` |
| Bugs | `POST /api/bugs`, `GET /api/bugs`, `GET /api/bugs/:id`, `PUT /api/bugs/:id`, `DELETE /api/bugs/:id` |
| Bug workflow | `PATCH /api/bugs/:id/status`, `PATCH /api/bugs/:id/assign` |
| Collaboration | `GET/POST /api/bugs/:id/comments`, comment update/delete, and `GET /api/bugs/:id/activities` |

## Local Setup

### Requirements

- Node.js 18 or newer
- MySQL
- A configured BugLogger database schema

### Backend

```bash
cd backend
npm install
npm run dev
```

The API runs on `http://localhost:5000` by default.

Create `backend/.env` with the following values:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=buglogger
JWT_SECRET=replace_with_a_long_random_secret
APP_URL=http://localhost:5173

# Required for password-reset email delivery
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Optional Google sign-in
GOOGLE_CLIENT_ID=your_google_client_id

# Optional Cloudinary media storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and expects the backend API at `http://localhost:5000/api`.

For a production build:

```bash
npm run build
```

## Current Status

BugLogger is an actively developed MVP with the main authentication, team, bug-management, collaboration, dashboard, profile, and settings workflows implemented. Deployment configuration, automated test coverage, role-based permissions, and production environment hardening can be added as next steps.

## Author

Manav Kalra
