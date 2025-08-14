# Dockerfile

# 1. Base Image for dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install

# 2. Builder Image: Build the Next.js application
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Accept the API key as a build argument
ARG NEXT_PUBLIC_TMDB_API_KEY
# Set it as an environment variable for the build process
ENV NEXT_PUBLIC_TMDB_API_KEY=$NEXT_PUBLIC_TMDB_API_KEY

# Build the app. Next.js will embed the public env var.
RUN npm run build

# 3. Production Image: Copy only the necessary files for production
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
