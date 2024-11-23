# Stage 1: Build
FROM node:22.11.0-alpine AS builder

# Set environment to production for optimal dependencies
ENV NODE_ENV=production

# Create and set the application directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source files
COPY . .

# Stage 2: Runtime
FROM node:22.11.0-alpine AS runtime

# Set environment to production
ENV NODE_ENV=production

# Create and set the application directory
WORKDIR /app

# Copy only what is necessary for runtime
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src ./src

# Expose application port
EXPOSE 8080

ENV PORT=8080

# Healthcheck for container health
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD curl -f http://localhost:2700/health || exit 1

# Run the application
CMD ["node", "."]