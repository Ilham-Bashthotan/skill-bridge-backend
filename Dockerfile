FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy source and build
COPY tsconfig*.json ./
COPY prisma ./prisma
COPY src ./src
# Generate Prisma client (creates types used by the TypeScript code)
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

# Production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --legacy-peer-deps || npm install --only=production --legacy-peer-deps

# Copy built app and prisma client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY prisma ./prisma

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE ${PORT}

# Health check for Railway
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:${PORT}/jobs', {timeout: 2000}, (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Copy startup script
COPY start.sh ./
RUN chmod +x start.sh

CMD ["./start.sh"]
