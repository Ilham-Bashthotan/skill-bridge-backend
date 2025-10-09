#!/bin/sh
set -e

echo "🚀 Starting Skill Bridge Backend..."
echo "Environment: ${NODE_ENV:-development}"
echo "Port: ${PORT:-3001}"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set!"
    exit 1
fi

echo "📊 Database URL configured"

# Wait a bit for database to be ready (Railway specific)
echo "⏳ Waiting for database to be ready..."
sleep 2

# Run database migration with retries
echo "🔄 Running database migrations..."
MAX_RETRIES=5
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if npx prisma migrate deploy --schema=./prisma/schema.prisma; then
        echo "✅ Database migrations completed successfully"
        break
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
            echo "⚠️  Migration failed (attempt $RETRY_COUNT/$MAX_RETRIES). Retrying in 3 seconds..."
            sleep 3
        else
            echo "❌ Migration failed after $MAX_RETRIES attempts. Exiting."
            exit 1
        fi
    fi
done

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate --schema=./prisma/schema.prisma

# Start the application
echo "🎯 Starting NestJS application..."
exec node dist/src/main