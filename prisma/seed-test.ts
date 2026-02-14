import { PrismaClient } from '../lib/prisma/generated/client';
import {
  TEST_USERS,
  createRandomDocument,
  createRandomDocumentRequest,
  createRandomFolder,
  createRandomFolderType,
  createRandomShareLink,
  createTestEmailVerificationTokens,
  ensureDefaultDocumentTypes,
  createTestPasswordResetTokens,
  createTestSessions,
  createTestUsers,
} from './seed';

const prisma = new PrismaClient();

// Lightweight test seeding function
export async function seedTestData() {
  console.log('🧹 Cleaning test data...');
  await cleanTestData();

  console.log('🏗️ Creating test data...');

  // Create auth test data
  const { users } = await createTestUsers();
  await ensureDefaultDocumentTypes();
  const sessions = await createTestSessions(users);
  const emailTokens = await createTestEmailVerificationTokens(users);
  const resetTokens = await createTestPasswordResetTokens(users);

  // Create minimal business data
  const folderType = await createRandomFolderType(users[0].id);
  const folder = await createRandomFolder(
    folderType.id,
    folderType.requiredDocuments,
    users[0].id,
  );
  const request = await createRandomDocumentRequest(
    folder.id,
    folderType.requiredDocuments,
  );
  const shareLink = await createRandomShareLink(request.id, request.createdAt);

  // Create a document for each required document type
  const documents = [];
  for (const docType of folderType.requiredDocuments.slice(0, 2)) {
    const document = await createRandomDocument(
      request.id,
      folder.id,
      docType,
      request.createdAt,
    );
    documents.push(document);
  }

  const testData = {
    users,
    sessions,
    emailTokens,
    resetTokens,
    folderType,
    folder,
    request,
    shareLink,
    documents,
    testUsers: TEST_USERS,
    stats: {
      users: users.length,
      sessions: sessions.length,
      emailTokens: emailTokens.length,
      resetTokens: resetTokens.length,
      folderTypes: 1,
      folders: 1,
      requests: 1,
      shareLinks: 1,
      documents: documents.length,
    },
  };

  console.log('✅ Test data created:', testData.stats);
  return testData;
}

// Clean test data function (used internally)
async function cleanTestData() {
  await prisma.document.deleteMany({});
  await prisma.requestShareLink.deleteMany({});
  await prisma.documentRequest.deleteMany({});
  await prisma.folder.deleteMany({});
  await prisma.folderType.deleteMany({});
  await prisma.passwordResetToken.deleteMany({});
  await prisma.emailVerificationToken.deleteMany({});
  await prisma.organizationSession.deleteMany({});
  await prisma.authProvider.deleteMany({});
  await prisma.organization.deleteMany({});
}

// Main execution for direct running
async function main() {
  try {
    await seedTestData();
  } catch (error) {
    console.error('❌ Test seeding failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
