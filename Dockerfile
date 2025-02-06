# Stage 1: Build Angular App
FROM node:22.12 AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the full source code
COPY . .

# Build Angular for production (output goes to dist/<app_name>/)
RUN npm run build --prod

# Stage 2: Serve with Nginx
FROM nginx:latest AS runner

# Copy build output to Nginx
COPY --from=builder /app/dist/bruba-ui /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for serving the frontend
EXPOSE 80
