#!/usr/bin/env node

import { execSync } from 'child_process'

// Set test database URL
const testDbUrl = process.env.TEST_DATABASE_URL || 'postgresql://postgres:password@localhost:5433/centradoc_test'

console.log('🐳 Starting test database container...')

try {
  // Start test database container
  execSync('docker compose -f docker-compose.test.yaml up -d', {
    stdio: 'inherit'
  })

  console.log('⏳ Waiting for database to be ready...')

  // Wait for database to be ready
  const maxAttempts = 30
  let attempts = 0

  while (attempts < maxAttempts) {
    try {
      execSync(`docker exec -i $(docker compose -f docker-compose.test.yaml ps -q postgres-test) pg_isready -U postgres`, {
        stdio: 'pipe'
      })
      break
    } catch {
      attempts++
      if (attempts >= maxAttempts) {
        throw new Error('Database failed to start within timeout period')
      }
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  console.log('🔄 Running database migrations...')

  // Run migrations on test database
  execSync(`DATABASE_URL="${testDbUrl}" npx prisma migrate dev --name test-setup`, {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: testDbUrl }
  })

  console.log('✅ Test database setup complete!')
  console.log(`📊 Database URL: ${testDbUrl}`)
} catch (error) {
  console.error('❌ Failed to setup test database:', error.message)
  process.exit(1)
}