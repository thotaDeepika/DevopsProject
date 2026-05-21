# CollabSpace DevOps Project Run Guide

This document outlines the steps to run the CollabSpace full-stack project, along with how to monitor the system using Prometheus and Grafana.

---

## 🚀 Architectural Overview
The application consists of the following components:
1. **Frontend (Client)**: React SPA served via Nginx (Docker) or Vite (Manual).
2. **Backend (Server)**: Node.js/Express REST API and Socket.IO server, instrumented with `prom-client` to expose metrics on `/metrics`.
3. **Database**: MongoDB container storing user data, workspaces, boards, and chats.
4. **Observability Stack**:
   - **Prometheus**: Scrapes `/metrics` from the Node.js server.
   - **Grafana**: Automatically configured with Prometheus as a datasource and pre-loaded with a custom dashboard.

---

## 🛠️ Port Mappings & Credentials

| Service | Port (Local) | Internal Port | URL | Credentials |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Client** | `8080` | `80` | [http://localhost:8080](http://localhost:8080) | *None* |
| **Backend Server** | `5000` | `5000` | [http://localhost:5000](http://localhost:5000) | *None* |
| **Metrics Endpoint** | `5000` | `5000` | [http://localhost:5000/metrics](http://localhost:5000/metrics) | *None* |
| **Prometheus UI** | `9090` | `9090` | [http://localhost:9090](http://localhost:9090) | *None* |
| **Grafana UI** | `3000` | `3000` | [http://localhost:3000](http://localhost:3000) | `admin` / `admin` |
| **MongoDB** | `27017` | `27017` | `mongodb://localhost:27017` | *None* |

---

## 🐳 Option 1: Running with Docker Compose (Recommended)

This is the fastest and most complete method. It runs all containers, mounts configuration volumes, and provisions Prometheus and Grafana automatically.

### Step 1: Navigate to the Project Root
Open a PowerShell/Terminal window and navigate to:
```powershell
cd d:\DevopsProject\collabspace
```

### Step 2: Configure Environment Variables
If you haven't already, copy `.env.example` to `.env` in the root:
```powershell
cp .env.example .env
```
*(The default values are pre-configured to work out-of-the-box for local database connections and JWT authentication. Cloudinary keys are only required if you need active file upload capabilities.)*

### Step 3: Run the Docker Compose Stack
Build and launch the containers:
```powershell
docker compose up --build -d
```
> [!NOTE]
> The `-d` flag runs the containers in the background. If you want to see the logs in real-time, omit the `-d` flag.

### Step 4: Verify the Services
Run the following command to check if all containers are healthy and running:
```powershell
docker compose ps
```

---

## ☸️ Option 2: Running with Kubernetes (k8s)

If you are using Minikube or another local Kubernetes cluster, you can deploy the complete stack using the manifests under `/k8s`.

### Step 1: Create Namespaces
Deploy configurations in separate namespaces to isolate monitoring:
```powershell
kubectl apply -f k8s/namespaces.yaml
```

### Step 2: Apply Configs and Secrets
Create the MongoDB URI config and JWT secrets:
```powershell
kubectl apply -f k8s/configs.yaml
```

### Step 3: Start Services
Deploy the Database, Server, and Client:
```powershell
kubectl apply -f k8s/mongo-deployment.yaml
kubectl apply -f k8s/server-deployment.yaml
kubectl apply -f k8s/client-deployment.yaml
```

### Step 4: Deploy the Prometheus & Grafana Monitoring Stack
Apply the pre-configured monitoring rules, services, and deployments:
```powershell
kubectl apply -f k8s/monitoring.yaml
```

### Step 5: Port-Forward to Access Services
To access the services on your local machine, run port-forwards in separate terminal sessions:
- **Frontend App**:
  ```powershell
  kubectl port-forward svc/client 8080:80 -n collabspace
  ```
- **Prometheus UI**:
  ```powershell
  kubectl port-forward svc/prometheus 9090:9090 -n monitoring
  ```
- **Grafana UI**:
  ```powershell
  kubectl port-forward svc/grafana 3000:3000 -n monitoring
  ```

---

## 📊 Viewing Prometheus and Grafana Metrics

### 1. Verify the `/metrics` Endpoint
Open [http://localhost:5000/metrics](http://localhost:5000/metrics) in your browser. You should see raw Prometheus metrics starting with `nodejs_` and `http_request_duration_seconds`.

### 2. Verify Prometheus Scraping Status
1. Open the Prometheus UI at [http://localhost:9090](http://localhost:9090).
2. Go to **Status** -> **Targets**.
3. You should see two targets active:
   - `collabspace-server` (points to `server:5000` with `UP` status)
   - `prometheus-infrastructure` (points to `localhost:9090` with `UP` status)

### 3. Log In to Grafana
1. Open the Grafana UI at [http://localhost:3000](http://localhost:3000).
2. Login with the default credentials:
   - **Username**: `admin`
   - **Password**: `admin`
3. If prompted to change the password, you can click **Skip** or configure a new password.

### 4. Access the Pre-configured Dashboard
1. In Grafana, click the sidebar menu and navigate to **Dashboards**.
2. Click on the **CollabSpace Backend Metrics** dashboard.
3. You will see a beautiful visualization of:
   - **HTTP Request Rate**: Graphs showing requests per second categorized by method and endpoint.
   - **HTTP Average Request Duration**: Performance tracking of API response latency.
   - **Node.js Process CPU Usage**: Live CPU utilization percentage.
   - **Node.js Memory Usage**: Graphs displaying RSS Memory, Heap Total, and Heap Used.

> [!TIP]
> To generate graph lines on the dashboard, navigate around the CollabSpace app at [http://localhost:8080](http://localhost:8080) (e.g., register an account, sign in, or create a board). This will generate HTTP requests and record metrics that will display on your Grafana charts instantly!
