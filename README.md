# DevopsProject (CollabSpace)

Full-stack collaboration app with workspaces, kanban-style boards, real-time chat, file sharing, and notifications.

## Features
- User authentication with JWT access/refresh tokens
- Workspaces, boards, tasks, and kanban workflows
- Real-time updates and chat via Socket.IO
- File uploads backed by Cloudinary
- Notification endpoints and health check

## Tech Stack
- **Client:** React + Vite, React Router, Zustand, Tailwind CSS
- **Server:** Node.js, Express, Socket.IO, MongoDB (Mongoose)
- **Infra:** Docker, Nginx

## Repository Structure
- `client/` - React frontend
- `server/` - Express API and Socket.IO server
- `docker-compose.yml` - Full stack setup (client, server, MongoDB)

## Prerequisites
- Node.js 18+ and npm
- MongoDB (local) or Docker
- Cloudinary account for file uploads (optional in local dev)

## Environment Variables
Copy the template and update values:

```bash
cp .env.example .env
```

Required variables (see `.env.example`):
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `FRONTEND_URL`

## Local Development

### Server
```bash
cd server
npm install
npm run dev
```
API runs on `http://localhost:5000` (health check: `/health`).

### Client
```bash
cd client
npm install
npm run dev
```
Vite dev server runs on `http://localhost:5173`.

## Docker
```bash
docker compose up --build
```

Client is served on `http://localhost` and the API on `http://localhost:5000`.

## Useful Scripts
Client:
- `npm run lint`
- `npm run build`

Server:
- `npm run dev`
- `npm start`
