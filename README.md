# BugLogger

BugLogger is a lightweight bug tracking system designed to help teams report, manage, and track software issues quickly and clearly. This repository contains the backend API (Node.js + Express) and a React frontend (in the `frontend/` folder) for an MVP workflow.

---

## Table of contents

- About
- Features
- Tech stack
- Getting started
  - Prerequisites
  - Environment variables
  - Database setup
  - Install & Run (backend)
  - Install & Run (frontend)
- API reference
- Project status & roadmap
- Contributing
- License
- Author

---

## About

BugLogger provides the basics of an issue tracker: user registration and authentication, organizations, and a dashboard showing aggregated information. It's meant as an MVP to build on with bug creation/listing and reporting features.

## Features

- User registration and authentication
- Password hashing with bcrypt
- Organization management
- Dashboard API with key metrics
- (Frontend) React + Vite single-page app located in `frontend/`

## Tech stack

- Node.js
- Express.js
- MySQL
- bcrypt
- React + Vite (frontend)
- Git & GitHub

---

## Getting started

These steps will get the project running locally.

### Prerequisites

- Node.js (v16 or newer recommended)
- npm or yarn
- MySQL server

### Environment variables

Create a `.env` file in the project root with values similar to:

```
PORT=4000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=buglogger_db
JWT_SECRET=your_jwt_secret
```

Adjust names to match the codebase if environment variable names differ; search the repo for `process.env.` usage.

### Database setup

1. Create a MySQL database (example):

   mysql -u root -p
   CREATE DATABASE buglogger_db;
   CREATE USER 'buglogger'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL PRIVILEGES ON buglogger_db.* TO 'buglogger'@'localhost';

2. Run any migration or schema scripts (if present) or use the SQL files in the repo. If migrations are not included, check code for table creation or seed scripts.

### Install & Run (backend)

1. Install dependencies:

```
npm install
```

2. Start the server (development):

```
npm run dev
```

Or if a start script exists:

```
npm start
```

The API should be available at http://localhost:4000 (or the PORT you set).

### Install & Run (frontend)

1. Move into the frontend folder:

```
cd frontend
```

2. Install dependencies and run:

```
npm install
npm run dev
```

Open the URL shown by Vite (usually http://localhost:5173) to view the frontend.

---

## API reference

Base URL: http://localhost:4000 (adjust to your PORT)

### Authentication

- POST /api/users
  - Register a new user
  - Body (example): `{ "name": "Alice", "email": "alice@example.com", "password": "secret" }`

- POST /api/auth/login
  - Login and receive a JWT
  - Body (example): `{ "email": "alice@example.com", "password": "secret" }`

### Dashboard

- GET /api/dashboard
  - Returns aggregated data for the user's organization (requires auth header `Authorization: Bearer <token>`)

Notes: Check your route middleware for exact header/auth behavior. Use a tool like Postman or curl to explore endpoints.

---

## Project status & roadmap

Current MVP (implemented):

- User registration
- User authentication
- Dashboard API

Planned / Upcoming features:

- Create Bug endpoint and UI
- List / View Bugs
- Update Bug status (open / in-progress / closed)
- Dashboard statistics and filters
- Organization roles & permissions
- Tests and CI pipeline

If you'd like to help, see Contributing below.

---

## Contributing

Contributions are welcome. Typical workflow:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes and push
4. Open a pull request with a clear description and any testing steps

Please add tests for new features if possible. Open an issue first for larger changes to discuss design.

---

## License

This project currently has no license file. Add a LICENSE (MIT, Apache-2.0, etc.) if you want to make the terms explicit.

---

## Author

Manav Kalra — manavkalra07

Contact: open issues or pull requests on this repository.
