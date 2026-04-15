# Development Dockerfile for React app using the official Bun image
FROM oven/bun:latest

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lock ./
RUN bun install

# Copy source
COPY . .

# Expose Vite dev port
EXPOSE 5173

# Start Vite dev server (listen on all interfaces)
CMD ["bun", "run", "dev", "--host", "0.0.0.0"]