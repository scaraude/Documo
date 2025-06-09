#!/usr/bin/env node

import { execSync } from 'child_process'

console.log('🗑️ Tearing down test database...')

try {
  // Stop and remove test database container
  execSync('docker compose -f docker-compose.test.yaml down -v', {
    stdio: 'inherit'
  })
  
  console.log('✅ Test database teardown complete!')
} catch (error) {
  console.error('❌ Failed to teardown test database:', error.message)
  process.exit(1)
}