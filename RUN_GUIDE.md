# CollabSpace Project Execution Guide

This project is a full-stack collaboration platform with a React frontend and a Node.js backend. You can run it using **Docker** (recommended for DevOps) or **Manually** on your local machine.

## Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Docker & Docker Compose** (Optional, but recommended)
- **MongoDB** (If running manually without Docker)

---

## Option 1: Running with Docker (Quickest)

If you have Docker installed, you can start the entire stack (Frontend, Backend, and MongoDB) with a single command.

1. **Navigate to the project root:**
   ```powershell
   cd d:\DevopsProject\collabspace
   ```

2. **Configure Environment Variables:**
   - Copy `.env.example` to `.env`.
   - Update the Cloudinary credentials if you want image upload functionality.

3. **Start the containers:**
   ```powershell
   docker-compose up --build
   ```

4. **Access the application:**
   - **Frontend:** [http://localhost](http://localhost) (mapped to port 80)
   - **Backend API:** [http://localhost:5000](http://localhost:5000)

---

## Option 2: Running Manually (Local Development)

If you prefer to run the components individually:

### 1. Setup Backend
1. Open a terminal and navigate to the server directory:
   ```powershell
   cd d:\DevopsProject\collabspace\server
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Create a `.env` file in the `server` directory (based on `.env.example`) and ensure your `MONGO_URI` is correct (e.g., `mongodb://localhost:27017/collabspace`).
4. Start the backend:
   ```powershell
   npm run dev
   ```

### 2. Setup Frontend
1. Open a **new** terminal and navigate to the client directory:
   ```powershell
   cd d:\DevopsProject\collabspace\client
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the frontend:
   ```powershell
   npm run dev
   ```
4. Access the frontend at [http://localhost:5173](http://localhost:5173) (default Vite port).

---

## Environment Variables Configuration
Make sure to set these in your `.env` file for the application to function correctly:

| Variable | Description |
| :--- | :--- |
| `MONGO_URI` | MongoDB Connection String |
| `JWT_SECRET` | Secret key for Authentication |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary Cloud Name (for media) |
| `CLOUDINARY_API_KEY` | Your Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API Secret |
| `FRONTEND_URL` | The URL where the frontend is running |
