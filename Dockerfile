# ===============================
# Stage 1: Build the Next.js app
# ===============================
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy the rest of your application source code
COPY . .

# Prisma needs OpenSSL
RUN apt-get update -y && apt-get install -y openssl libssl3

# Generate Prisma client
# Use dummy DATABASE_URL to allow generation
ENV DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
RUN npx prisma generate

# Build Next.js app for production
RUN npm run build


# =====================================
# Stage 2: Run the production container
# =====================================
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# Copy uploads directory (important for saving/serving images)
RUN mkdir -p /app/files/uploads
ENV UPLOAD_DIR=/app/files/uploads

# Expose app port
EXPOSE 3000

# Start the Next.js server and Prisma migrations
COPY --from=builder /app/start.sh ./start.sh
RUN chmod +x ./start.sh
CMD ["./start.sh"]
