# Stage 1: Build
FROM node:22.11.0-alpine AS builder

# Set environment to production for optimal dependencies
ENV NODE_ENV=production

# Create and set the application directory
WORKDIR /app

# Copy package.json and package-lock.json for dependencies installation
COPY package*.json ./

# Install all dependencies (including devDependencies for the build step)
RUN npm ci

# Copy application source files
COPY . .

# Stage 2: Runtime
FROM node:22.11.0-alpine AS runtime

# Set the environment to production for runtime
ENV NODE_ENV=production

# Create and set the application directory
WORKDIR /app

# Copy production dependencies and application source files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src ./src

# Set a non-root user
USER node

# Expose application port
EXPOSE 2700

# Healthcheck for container health
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD curl -f http://localhost:2700/health || exit 1

# Run the application
CMD ["node", "."]