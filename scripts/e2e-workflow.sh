#!/bin/bash

# E2E Test Workflow Script
# This script runs the complete E2E test workflow for the document transfer app

set -e

echo "🎭 Starting E2E test workflow..."

# Step 1: Setup test database (for any database-dependent tests)
echo "🐳 Setting up test database..."
yarn test:setup-db

# Step 2: Generate Prisma client for test environment
echo "🔧 Generating Prisma client..."
TEST_DATABASE_URL=postgresql://postgres:password@localhost:5433/centradoc_test npx prisma generate

# Step 3: Install Playwright browsers if needed
echo "🌐 Ensuring Playwright browsers are installed..."
npx playwright install --with-deps

# Step 4: Run E2E tests
echo "🧪 Running E2E tests..."
yarn test:e2e

echo "✅ All E2E tests passed successfully!"
echo "🗑️ Cleaning up test database..."
yarn test:teardown-db

echo "🎉 E2E test workflow completed!"