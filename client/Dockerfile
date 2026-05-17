# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Arguments
ARG VITE_API_URL=http://localhost:5000/api
ARG VITE_SOCKET_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Configure Nginx to route all traffic to index.html for React Router SPA
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
