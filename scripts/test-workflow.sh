#!/bin/bash

# Test Workflow Script
# This script runs the complete test workflow for the document transfer app

set -e

echo "🚀 Starting test workflow..."

# Step 1: Setup test database
echo "🐳 Setting up test database..."
yarn test:setup-db

# Step 2: Run integration tests
echo "🧪 Running integration tests..."
yarn test:integration

# Step 3: Run unit tests
echo "🔬 Running unit tests..."
yarn test

# Step 4: Run linting
echo "🧹 Running linter..."
yarn lint

echo "✅ All tests passed successfully!"
echo "🗑️ Cleaning up test database..."
yarn test:teardown-db

echo "🎉 Test workflow completed!"