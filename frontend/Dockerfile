# Stage 1: Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Install libc6-compat (required for some process bindings on Alpine)
RUN apk add --no-cache libc6-compat

# Copy dependency configuration files
COPY package.json package-lock.json ./

# Install dependencies including devDependencies for build
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Production runner stage
FROM node:22-alpine AS runner
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Expose the port Next.js runs on
EXPOSE 3000

# Copy runtime configuration and build outputs from build stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Install only production dependencies to keep the image lightweight
RUN npm ci --omit=dev

# Start Next.js in production mode
CMD ["npm", "start"]
