#     Updated Base Image: Switched to node:22.11.0-alpine for a lightweight and modern Node.js version.
#     Multi-Stage Build: Split into builder and runtime stages for smaller and more secure production images.
#     npm ci: Used for cleaner, deterministic installations.
#     Local Tool Installation: Typescript and ts-node installed locally to avoid global dependency pollution.
#     Non-Root User: Runs the application as a non-root user to enhance security.
#     Clean .env: Improved safety by maintaining separation of build and runtime.
#     Best Practices: Optimized Docker layers to reduce image size and improve caching.

# Stage 1: Build
FROM node:22.11.0-alpine AS builder

# Set environment to production for optimal dependencies
ENV NODE_ENV=production

# Create and set the application directory
WORKDIR /app

# Copy package.json and package-lock.json for dependencies installation
COPY package*.json ./

# Install dependencies with npm ci for a clean install
RUN npm ci --omit=dev

# Install global tools locally to avoid global pollution and run as root
RUN npx npm@8 install typescript ts-node

# Change to non-root user for better security
USER node

# Copy application source files
COPY --chown=node:node . .

# Build the application
RUN npm run build

# Stage 2: Runtime
FROM node:22.11.0-alpine AS runtime

# Set the environment to production for runtime
ENV NODE_ENV=production

# Create and set the application directory
WORKDIR /app

# Copy dependencies and built application from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build

# Copy environment config and necessary files
COPY --chown=node:node .env .env
COPY --chown=node:node ./config ./config
COPY --chown=node:node ./public ./public

# Set a non-root user
USER node

# Expose application port
EXPOSE 2700

# Run the application
CMD ["node", "build/server.js"]
