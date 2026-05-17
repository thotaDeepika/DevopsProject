FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# Install only production dependencies to keep image small
RUN npm ci --omit=dev

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
