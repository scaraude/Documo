# Auth Seed Data Documentation

## Overview

The enhanced seed files now include comprehensive authentication test data to support robust testing of auth functions, sessions, tokens, and user management workflows.

## Test Users

### Available Test Users

| User Type | Email | Password | Status | Purpose |
|-----------|-------|----------|--------|---------|
| **Verified** | `test@example.com` | `password123` | ✅ Verified | Basic auth testing |
| **Unverified** | `unverified@example.com` | `password123` | ❌ Unverified | Email verification testing |
| **Admin** | `admin@documo.com` | `SecureAdmin123!` | ✅ Verified | Admin/privileged operations |
| **Active Session** | `active@example.com` | `SecurePass123!` | ✅ Verified | Session management testing |
| **Multiple Sessions** | `multi@example.com` | `SecurePass123!` | ✅ Verified | Multi-device session testing |

### Usage in Tests

```typescript
import { TEST_USERS } from '../../../prisma/seed';

// Use predefined test users
await authRepository.authenticateUser({
  email: TEST_USERS.verified.email,
  password: TEST_USERS.verified.password
});
```

## Test Sessions

### Session Types Created

1. **Active Session** - Valid, non-expired session for activeSessionUser
2. **Multiple Sessions** - 3 sessions for multipleSessionUser simulating:
   - Desktop Chrome (Windows)
   - Mobile Safari (iPhone)
   - Desktop Chrome (macOS)
3. **Expired Session** - Session that expired yesterday
4. **Revoked Session** - Session that was manually revoked

### Session Data Structure

```typescript
{
  userId: string,
  token: string, // Unique 64-character hex token
  expiresAt: Date, // 7 days from creation
  userAgent: string, // Realistic browser strings
  ipAddress: string, // Private IP ranges
  createdAt: Date,
  revokedAt: Date | null
}
```

## Email Verification Tokens

### Token Types Created

1. **Valid Token** - Active token for unverified user (24h expiry)
2. **Expired Token** - Token that expired 1 hour ago
3. **Used Token** - Token that was already consumed

### Token Testing Scenarios

```typescript
// Valid verification
await authRepository.verifyEmail('verify_abc123...');

// Expired token handling
await authRepository.verifyEmail('expired_verify_xyz789...');

// Already used token
await authRepository.verifyEmail('used_verify_def456...');
```

## Password Reset Tokens

### Token Types Created

1. **Valid Reset Token** - Active token (1h expiry)
2. **Expired Reset Token** - Token that expired 1 hour ago  
3. **Used Reset Token** - Token that was already consumed

### Reset Testing Scenarios

```typescript
// Valid password reset
await authRepository.resetPassword('reset_abc123...', 'NewPassword123!');

// Expired token handling
await authRepository.resetPassword('expired_reset_xyz789...', 'NewPassword123!');

// Already used token
await authRepository.resetPassword('used_reset_def456...', 'NewPassword123!');
```

## Running Seed Commands

### Test Database Seeding

```bash
# Lightweight test data (recommended for tests)
yarn test:seed

# Full development data
yarn seed
```

### Environment-Specific Seeding

```bash
# Development database
yarn seed

# Test database (isolated)
TEST_DATABASE_URL=postgresql://postgres:password@localhost:5433/documo_test yarn seed
```

## Seed Statistics

### Test Seed Output
```
✅ Test data created: {
  users: 5,              // All test user types
  sessions: 6,            // Various session states
  emailTokens: 3,         // Verification token states
  resetTokens: 3,         // Password reset token states
  folderTypes: 1,         // Minimal business data
  folders: 1,
  requests: 1,
  shareLinks: 1,
  documents: 2
}
```

### Full Seed Output
```
📊 Statistics: {
  users: 5,                     // Test users
  authProviders: 5,             // Email/password providers
  userSessions: 6,              // Test sessions
  emailVerificationTokens: 3,   // Verification tokens
  passwordResetTokens: 3,       // Reset tokens
  folderTypes: 8,               // Business data
  folders: 32,
  requests: 64,
  shareLinks: 64,
  documents: 184
}
```

## Integration with Tests

### Repository Tests

The seed data provides comprehensive scenarios for testing:

```typescript
// Test with verified user
const verifiedUser = await authRepository.findUserByEmail(TEST_USERS.verified.email);

// Test session validation
const activeSession = await authRepository.findSessionByToken('session_abc123...');

// Test token expiration
const expiredToken = await authRepository.verifyEmail('expired_verify_xyz789...');
```

### Integration Tests

```typescript
// Test complete auth flows
const loginResult = await trpc.auth.login.mutate({
  email: TEST_USERS.verified.email,
  password: TEST_USERS.verified.password
});

// Test session management
const sessions = await trpc.auth.sessions.query();
```

## Security Considerations

### Password Hashing
- All test passwords are properly hashed using bcrypt with 12 rounds
- No plaintext passwords stored in database

### Token Generation
- Uses `crypto.randomBytes()` for secure token generation
- Tokens are properly prefixed for identification
- Realistic expiration times for testing scenarios

### Session Security
- Realistic user agent strings and IP addresses
- Proper expiration and revocation handling
- Multiple device simulation

## Best Practices

### Test Isolation
```typescript
beforeEach(async () => {
  // Clean and reseed for each test
  await seedTestData();
});
```

### Environment Separation
```typescript
// Always use test database for tests
process.env.TEST_DATABASE_URL = 'postgresql://localhost:5433/documo_test';
```

### Data Cleanup
```typescript
afterAll(async () => {
  // Clean up test data
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});
```

This enhanced seed data provides a robust foundation for comprehensive auth testing while maintaining clean separation between test and development environments.