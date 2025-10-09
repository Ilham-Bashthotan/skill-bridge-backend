#!/bin/sh
# Railway Debug Script
# This script helps debug Railway deployment issues

echo "🔍 Railway Deployment Debug Information"
echo "======================================"

echo "\n📊 Environment Variables:"
echo "NODE_ENV: ${NODE_ENV:-'Not set'}"
echo "PORT: ${PORT:-'Not set'}"
echo "DATABASE_URL: $(if [ -n "$DATABASE_URL" ]; then echo "Set ($(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/Host: \1/p'))"; else echo "Not set"; fi)"

echo "\n🗂️  Working Directory:"
pwd
echo "\n📁 Directory Contents:"
ls -la

echo "\n🔧 Prisma Configuration:"
if [ -f "prisma/schema.prisma" ]; then
    echo "✅ schema.prisma found"
    echo "Datasource:"
    grep -A 3 "datasource" prisma/schema.prisma || echo "Could not read datasource"
else
    echo "❌ schema.prisma not found"
fi

echo "\n📦 Node.js Version:"
node --version

echo "\n📋 Package.json Scripts:"
if [ -f "package.json" ]; then
    node -e "console.log(JSON.stringify(require('./package.json').scripts, null, 2))" 2>/dev/null || echo "Could not read package.json"
fi

echo "\n🌐 Network Connectivity Test:"
if command -v curl >/dev/null 2>&1; then
    echo "Testing external connectivity..."
    curl -s --connect-timeout 5 https://www.google.com > /dev/null && echo "✅ External connectivity OK" || echo "❌ External connectivity failed"
else
    echo "curl not available, skipping network test"
fi

echo "\n🎯 Starting Application..."