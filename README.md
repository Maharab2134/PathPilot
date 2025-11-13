 
# PathPilot

PathPilot is a smart career-quiz and recommendation platform. It helps users discover career paths by taking quizzes, tracks attempts, shows leaderboards, and provides an admin interface to manage categories, questions and users.

This repository is a monorepo with two main folders:
- `backend/` — Node.js + Express API written in TypeScript. Handles authentication, quizzes, categories, uploads, and data persistence with MongoDB.
- `frontend/` — React + Vite application (TypeScript) that provides the user interface for taking quizzes, managing profiles, and admin pages.

## Core functionality

- User authentication (register/login) with JWT access + refresh tokens.
- User profiles with avatar upload.
- Quiz engine: questions, randomized question selection, attempt recording.
- Career recommendation engine based on quiz results.
- Categories and question management (admin routes/UI).
- Leaderboards and attempt history.
- Realtime features (Socket.IO) used where applicable.

## Architecture

- Backend: Express (TypeScript) with Mongoose for MongoDB models. Multer handles file uploads. Routes are grouped under `/api`.
- Frontend: React + Vite + TypeScript. Axios is used to call the API. Tailwind CSS for styling.
- Monorepo layout keeps frontend and backend separate but versioned together for convenience.

## Technology stack

- Backend
	- Node.js, Express, TypeScript
	- MongoDB with Mongoose
	- JWT for access/refresh tokens
	- Multer for file uploads
	- Helmet, CORS, express-rate-limit for security
	- Socket.IO for realtime features
	- Jest + Supertest for tests

- Frontend
	- React, Vite, TypeScript
	- Tailwind CSS
	- Axios for HTTP

## Quickstart (development)

Prerequisites
- Node.js (v18+ recommended)
- npm
- MongoDB running locally or a connection string to a MongoDB Atlas cluster

1) Install dependencies

Backend

```bash
cd backend
npm install
```

Frontend

```bash
cd frontend
npm install
```

2) Environment variables

Create `.env` in `backend/` (example):

```properties
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pathpilot
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
# Absolute path where uploaded avatars should be stored
UPLOAD_PATH=/uploads/profile
MAX_FILE_SIZE=5242880
```

Frontend environment (optional) — create `frontend/.env` or set env in your dev shell:

```
VITE_API_URL=http://localhost:5000/api
```

3) Run the apps

Start backend (hot reload):

```bash
cd backend
npm run dev
```

Start frontend:

```bash
cd frontend
npm run dev
```

Open the frontend (Vite will print the dev URL, commonly http://localhost:5173).

## Uploads and static files

- The backend exposes uploaded profile images at `/uploads/profile/<filename>` using express.static. `UPLOAD_PATH` should point to the directory on disk where files are stored.
- Example: if `UPLOAD_PATH=/home/dev/.../backend/uploads/profile`, a file saved as `avatar-123.png` will be available at:

```
http://localhost:5000/uploads/profile/avatar-123.png
```

Tips for testing uploads with curl (replace token and path):

```bash
# Create a small test image locally (no network required)
echo 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==' | base64 --decode > /tmp/avatar.png

# Login and get token (or use your stored token)
curl -s -X POST "http://localhost:5000/api/auth/login" -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'

# Upload (use absolute path to avoid curl errors)
curl -v -X PUT "http://localhost:5000/api/auth/profile" \
	-H "Authorization: Bearer <ACCESS_TOKEN>" \
	-F "avatar=@/tmp/avatar.png" \
	-F "name=Upload Test"
```

Common curl issues
- curl error (26): means curl couldn't read the local file — use an absolute path and verify the file exists.
- HTTP 401 Unauthorized: missing/invalid access token. Use the `login` route to retrieve an access token and pass it in the `Authorization: Bearer <token>` header.

## Testing

- Backend tests: Jest + Supertest. From `backend/` run:

```bash
npm test
```

## Production & deployment notes

- Persist uploads: if deploying to containers, mount a persistent volume for the uploads path or use object storage (S3) instead of local disk.
- Use environment variables for secrets and connection strings in your deployment platform (Docker secrets, AWS Parameter Store, etc.).
- Serve the built frontend from a static hosting provider (Netlify, Vercel) or from the backend (build and serve `dist`), and set `VITE_API_URL` to the production API base.

Suggested production steps (Docker)

- Build backend and frontend containers; ensure backend exposes port 5000 and `UPLOAD_PATH` is mounted to a persistent volume.
- Use a reverse proxy (NGINX) in front of the backend + frontend for TLS termination and routing.

## Security & hardening

- Keep JWT secrets strong and rotate them if needed.
- Validate and sanitize all input (express-validator used in this project).
- Limit upload size and restrict to image MIME types (Multer fileFilter used here).
- Use HTTPS in production.

## CI / CD recommendations

- Add GitHub Actions to:
	- Run lint/tests on PRs
	- Build and push Docker images for releases

## Troubleshooting

- If uploaded files don't appear after upload:
	- Verify `UPLOAD_PATH` points to the directory your server uses and that the backend process can write to it (ownership/permissions).
	- Check backend logs for multer or filesystem errors.
	- Confirm the `avatarUrl` returned by the API is accessible (open it in browser or `curl -I`).

## Next steps / improvements

- Implement avatar storage in S3 (or other object storage) for scalability.
- Add server-side image resizing and optimization.
- Normalize avatar URLs in `AuthContext` so front-end always receives absolute URLs.
- Add more automated tests for file upload and profile update flows.

---

If you'd like, I can:
- normalize avatar URLs in `AuthContext` now (so every component gets an absolute URL), or
- add a short GitHub Actions workflow to run tests on push/PR.

Happy to add either one — tell me which and I'll implement it.

