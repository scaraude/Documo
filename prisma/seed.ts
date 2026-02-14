/**
 * Database Seeding Script
 *
 * This script seeds the database with realistic test data for Centradoc.
 * The app uses an email-based system where document requests are sent to recipients
 * via email addresses instead of civil IDs.
 *
 * Generated data includes:
 * - Folder types with required documents
 * - Folders for document organization
 * - Document requests with realistic email addresses
 * - Share links for external access
 * - Documents with various states (uploaded, validated, etc.)
 */

import * as crypto from 'crypto';
import { faker } from '@faker-js/faker';
import { addDays, addHours } from 'date-fns';
import { hashPassword } from '../features/auth/utils/password';
import { getPrismaClientOptions } from '../lib/prisma/clientOptions';
import {
  type DocumentType,
  PrismaClient,
  ProviderType,
} from '../lib/prisma/generated/client';
const prisma = new PrismaClient(getPrismaClientOptions());

// Document type IDs from seed-document-types.ts
const DOCUMENT_TYPE_IDS = [
  'IDENTITY_PROOF',
  'DRIVERS_LICENSE',
  'BANK_STATEMENT',
  'RESIDENCY_PROOF',
  'TAX_RETURN',
  'EMPLOYMENT_CONTRACT',
  'SALARY_SLIP',
  'INSURANCE_CERTIFICATE',
  'OTHER',
];

const DEFAULT_DOCUMENT_TYPES = [
  { id: 'IDENTITY_PROOF', label: "Pièce d'identité" },
  { id: 'DRIVERS_LICENSE', label: 'Permis de conduire' },
  { id: 'BANK_STATEMENT', label: 'Relevé bancaire' },
  { id: 'RESIDENCY_PROOF', label: 'Justificatif de domicile' },
  { id: 'TAX_RETURN', label: "Déclaration d'impôts" },
  { id: 'EMPLOYMENT_CONTRACT', label: 'Contrat de travail' },
  { id: 'SALARY_SLIP', label: 'Bulletin de salaire' },
  { id: 'BIRTH_CERTIFICATE', label: 'Acte de naissance' },
  { id: 'MARRIAGE_CERTIFICATE', label: 'Acte de mariage' },
  { id: 'DIPLOMA', label: 'Diplôme' },
  { id: 'MEDICAL_CERTIFICATE', label: 'Certificat médical' },
  { id: 'LEASE_AGREEMENT', label: 'Contrat de location' },
  { id: 'INSURANCE_CERTIFICATE', label: "Attestation d'assurance" },
  { id: 'OTHER', label: 'Autre document' },
] as const;

// Helper function to get random subset of document types
function getRandomDocumentTypes(min = 1, max = 4): string[] {
  const count = faker.number.int({ min, max });
  const shuffled = [...DOCUMENT_TYPE_IDS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper function to generate random DEK
function generateDEK(): string {
  return crypto.randomBytes(32).toString('base64');
}

async function ensureDefaultDocumentTypes() {
  for (const docType of DEFAULT_DOCUMENT_TYPES) {
    await prisma.documentType.upsert({
      where: { id: docType.id },
      create: {
        id: docType.id,
        label: docType.label,
        acceptedFormats: ['pdf', 'jpg', 'png'],
        maxSizeMB: 5,
      },
      update: {
        label: docType.label,
        acceptedFormats: ['pdf', 'jpg', 'png'],
        maxSizeMB: 5,
      },
    });
  }
}

// Test user data configuration
export const TEST_USERS = {
  verified: {
    email: 'test@example.com',
    password: 'password123',
    organizationName: 'Test Organization',
    initials: 'TE',
  },
  unverified: {
    email: 'unverified@example.com',
    password: 'password123',
    organizationName: 'Unverified Organization',
    initials: 'UN',
  },
  admin: {
    email: 'admin@documo.com',
    password: 'SecureAdmin123!',
    organizationName: 'Admin Organization',
    initials: 'AD',
  },
  activeSession: {
    email: 'active@example.com',
    password: 'SecurePass123!',
    organizationName: 'Active Organization',
    initials: 'AC',
  },
  multipleSession: {
    email: 'multi@example.com',
    password: 'SecurePass123!',
    organizationName: 'Multiple Sessions Organization',
    initials: 'MU',
  },
} as const;

// Create test users for authentication testing
async function createTestUsers() {
  console.log('👤 Creating test users...');

  const users = [];

  // Create a verified test user
  const testUser = await prisma.organization.create({
    data: {
      email: TEST_USERS.verified.email,
      name: TEST_USERS.verified.organizationName,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.authProvider.create({
    data: {
      organizationId: testUser.id,
      providerType: ProviderType.EMAIL_PASSWORD,
      providerId: TEST_USERS.verified.email,
      passwordHash: await hashPassword(TEST_USERS.verified.password),
      isVerified: true,
      emailVerifiedAt: new Date(),
      providerData: {},
    },
  });
  users.push(testUser);

  // Create an unverified test user
  const unverifiedUser = await prisma.organization.create({
    data: {
      email: TEST_USERS.unverified.email,
      name: TEST_USERS.unverified.organizationName,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.authProvider.create({
    data: {
      organizationId: unverifiedUser.id,
      providerType: ProviderType.EMAIL_PASSWORD,
      providerId: TEST_USERS.unverified.email,
      passwordHash: await hashPassword(TEST_USERS.unverified.password),
      isVerified: false,
      emailVerifiedAt: null,
      providerData: {},
    },
  });
  users.push(unverifiedUser);

  // Create admin user
  const adminUser = await prisma.organization.create({
    data: {
      email: TEST_USERS.admin.email,
      name: TEST_USERS.admin.organizationName,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.authProvider.create({
    data: {
      organizationId: adminUser.id,
      providerType: ProviderType.EMAIL_PASSWORD,
      providerId: TEST_USERS.admin.email,
      passwordHash: await hashPassword(TEST_USERS.admin.password),
      isVerified: true,
      emailVerifiedAt: new Date(),
      providerData: {},
    },
  });
  users.push(adminUser);

  // Create user with active session
  const activeSessionUser = await prisma.organization.create({
    data: {
      email: TEST_USERS.activeSession.email,
      name: TEST_USERS.activeSession.organizationName,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.authProvider.create({
    data: {
      organizationId: activeSessionUser.id,
      providerType: ProviderType.EMAIL_PASSWORD,
      providerId: TEST_USERS.activeSession.email,
      passwordHash: await hashPassword(TEST_USERS.activeSession.password),
      isVerified: true,
      emailVerifiedAt: new Date(),
      providerData: {},
    },
  });
  users.push(activeSessionUser);

  // Create user with multiple sessions
  const multipleSessionUser = await prisma.organization.create({
    data: {
      email: TEST_USERS.multipleSession.email,
      name: TEST_USERS.multipleSession.organizationName,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.authProvider.create({
    data: {
      organizationId: multipleSessionUser.id,
      providerType: ProviderType.EMAIL_PASSWORD,
      providerId: TEST_USERS.multipleSession.email,
      passwordHash: await hashPassword(TEST_USERS.multipleSession.password),
      isVerified: true,
      emailVerifiedAt: new Date(),
      providerData: {},
    },
  });
  users.push(multipleSessionUser);

  console.log('✅ Test users created successfully');
  return {
    testUser,
    unverifiedUser,
    adminUser,
    activeSessionUser,
    multipleSessionUser,
    users,
  };
}

// Create test sessions for testing session management
async function createTestSessions(users: any[]) {
  console.log('🔑 Creating test sessions...');

  const sessions = [];

  // Create active session for activeSessionUser
  const activeSession = await prisma.organizationSession.create({
    data: {
      organizationId: users.find((u) => u.email === TEST_USERS.activeSession.email)?.id,
      token: `session_${crypto.randomBytes(32).toString('hex')}`,
      expiresAt: addDays(new Date(), 7),
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ipAddress: '192.168.1.100',
      createdAt: new Date(),
      revokedAt: null,
    },
  });
  sessions.push(activeSession);

  // Create multiple sessions for multipleSessionUser
  const multipleSessionUser = users.find(
    (u) => u.email === TEST_USERS.multipleSession.email,
  );
  if (multipleSessionUser) {
    const sessionData = [
      {
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        ipAddress: '192.168.1.101',
        createdAt: new Date(),
      },
      {
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        ipAddress: '192.168.1.102',
        createdAt: addHours(new Date(), -2),
      },
      {
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        ipAddress: '192.168.1.103',
        createdAt: addHours(new Date(), -4),
      },
    ];

    for (const data of sessionData) {
      const session = await prisma.organizationSession.create({
        data: {
          organizationId: multipleSessionUser.id,
          token: `session_${crypto.randomBytes(32).toString('hex')}`,
          expiresAt: addDays(data.createdAt, 7),
          userAgent: data.userAgent,
          ipAddress: data.ipAddress,
          createdAt: data.createdAt,
          revokedAt: null,
        },
      });
      sessions.push(session);
    }
  }

  // Create expired session for testing
  const expiredSession = await prisma.organizationSession.create({
    data: {
      organizationId: users.find((u) => u.email === TEST_USERS.verified.email)?.id,
      token: `expired_session_${crypto.randomBytes(32).toString('hex')}`,
      expiresAt: addDays(new Date(), -1), // Expired yesterday
      userAgent: 'Mozilla/5.0 (Test Browser)',
      ipAddress: '192.168.1.200',
      createdAt: addDays(new Date(), -8),
      revokedAt: null,
    },
  });
  sessions.push(expiredSession);

  // Create revoked session for testing
  const revokedSession = await prisma.organizationSession.create({
    data: {
      organizationId: users.find((u) => u.email === TEST_USERS.verified.email)?.id,
      token: `revoked_session_${crypto.randomBytes(32).toString('hex')}`,
      expiresAt: addDays(new Date(), 7),
      userAgent: 'Mozilla/5.0 (Revoked Browser)',
      ipAddress: '192.168.1.201',
      createdAt: addHours(new Date(), -1),
      revokedAt: new Date(), // Already revoked
    },
  });
  sessions.push(revokedSession);

  console.log('✅ Test sessions created successfully');
  return sessions;
}

// Create test email verification tokens
async function createTestEmailVerificationTokens(_users: any[]) {
  console.log('📧 Creating test email verification tokens...');

  const tokens = [];

  // Create valid verification token for unverified user
  const validToken = await prisma.emailVerificationToken.create({
    data: {
      email: TEST_USERS.unverified.email,
      token: `verify_${crypto.randomBytes(16).toString('hex')}`,
      expiresAt: addHours(new Date(), 24),
      createdAt: new Date(),
      usedAt: null,
    },
  });
  tokens.push(validToken);

  // Create expired verification token
  const expiredToken = await prisma.emailVerificationToken.create({
    data: {
      email: TEST_USERS.unverified.email,
      token: `expired_verify_${crypto.randomBytes(16).toString('hex')}`,
      expiresAt: addHours(new Date(), -1), // Expired 1 hour ago
      createdAt: addHours(new Date(), -25),
      usedAt: null,
    },
  });
  tokens.push(expiredToken);

  // Create used verification token
  const usedToken = await prisma.emailVerificationToken.create({
    data: {
      email: TEST_USERS.verified.email,
      token: `used_verify_${crypto.randomBytes(16).toString('hex')}`,
      expiresAt: addHours(new Date(), 24),
      createdAt: addHours(new Date(), -1),
      usedAt: new Date(), // Already used
    },
  });
  tokens.push(usedToken);

  console.log('✅ Test email verification tokens created successfully');
  return tokens;
}

// Create test password reset tokens
async function createTestPasswordResetTokens(_users: any[]) {
  console.log('🔐 Creating test password reset tokens...');

  const tokens = [];

  // Create valid reset token
  const validResetToken = await prisma.passwordResetToken.create({
    data: {
      email: TEST_USERS.verified.email,
      token: `reset_${crypto.randomBytes(16).toString('hex')}`,
      expiresAt: addHours(new Date(), 1),
      createdAt: new Date(),
      usedAt: null,
    },
  });
  tokens.push(validResetToken);

  // Create expired reset token
  const expiredResetToken = await prisma.passwordResetToken.create({
    data: {
      email: TEST_USERS.verified.email,
      token: `expired_reset_${crypto.randomBytes(16).toString('hex')}`,
      expiresAt: addHours(new Date(), -1), // Expired 1 hour ago
      createdAt: addHours(new Date(), -2),
      usedAt: null,
    },
  });
  tokens.push(expiredResetToken);

  // Create used reset token
  const usedResetToken = await prisma.passwordResetToken.create({
    data: {
      email: TEST_USERS.verified.email,
      token: `used_reset_${crypto.randomBytes(16).toString('hex')}`,
      expiresAt: addHours(new Date(), 1),
      createdAt: addHours(new Date(), -1),
      usedAt: new Date(), // Already used
    },
  });
  tokens.push(usedResetToken);

  console.log('✅ Test password reset tokens created successfully');
  return tokens;
}

// Generate random folder type
async function createRandomFolderType(createdByOrganizationId: string) {
  const folderTypeNames = [
    'Dossier Location Résidence Principale',
    'Dossier Location Commercial',
    'Dossier Achat Résidence',
    'Dossier Investissement Locatif',
    'Dossier Prêt Immobilier',
    'Dossier Location Saisonnière',
    'Dossier Vente Immobilière',
    'Dossier Refinancement',
    'Dossier Assurance Habitation',
    'Dossier Caution Solidaire',
  ];

  const descriptions = [
    "Documents requis pour une demande de location d'appartement ou maison",
    'Documents requis pour une demande de location de local commercial',
    "Documents requis pour l'achat d'un bien immobilier",
    'Documents requis pour un investissement locatif',
    'Documents requis pour une demande de prêt immobilier',
    'Documents requis pour une location saisonnière',
    "Documents requis pour la vente d'un bien immobilier",
    'Documents requis pour un refinancement',
    'Documents requis pour une assurance habitation',
    'Documents requis pour se porter caution solidaire',
  ];

  const name = faker.helpers.arrayElement(folderTypeNames);
  const description = faker.helpers.arrayElement(descriptions);
  const requiredDocuments = getRandomDocumentTypes(2, 5);

  return prisma.folderType.create({
    data: {
      name,
      description,
      requiredDocuments: {
        connect: requiredDocuments.map((doc) => ({ id: doc })),
      },
      createdByOrganizationId,
      deletedAt: Math.random() < 0.1 ? faker.date.past() : null, // 10% chance of soft delete
    },
    include: {
      requiredDocuments: true,
    },
  });
}

// Generate random folder
async function createRandomFolder(
  folderTypeId: string,
  folderTypeRequiredDocs: DocumentType[],
  createdByOrganizationId: string,
) {
  const cities = [
    'Paris',
    'Lyon',
    'Marseille',
    'Toulouse',
    'Nice',
    'Nantes',
    'Strasbourg',
    'Montpellier',
    'Bordeaux',
    'Lille',
    'Rennes',
  ];
  const propertyTypes = [
    'Studio',
    'T2',
    'T3',
    'T4',
    'Maison',
    'Loft',
    'Local Commercial',
    'Bureau',
  ];

  const city = faker.helpers.arrayElement(cities);
  const propertyType = faker.helpers.arrayElement(propertyTypes);
  const address = faker.location.streetAddress();

  const name = `${propertyType} ${city}`;
  const description = `${propertyType} - ${address}, ${city}`;

  const isCompleted = Math.random() < 0.3; // 30% chance of being completed
  const isArchived = Math.random() < 0.1; // 10% chance of being archived
  const hasActivity = Math.random() < 0.8; // 80% chance of recent activity

  return prisma.folder.create({
    data: {
      name,
      description,
      folderTypeId,
      requestedDocuments: {
        connect: folderTypeRequiredDocs.map((doc) => ({ id: doc.id })),
      },
      createdByOrganizationId,
      expiresAt:
        Math.random() < 0.7
          ? addDays(new Date(), faker.number.int({ min: 7, max: 90 }))
          : null,
      completedAt: isCompleted ? faker.date.past() : null,
      archivedAt: isArchived ? faker.date.past() : null,
      lastActivityAt: hasActivity
        ? faker.date.recent({ days: 7 })
        : faker.date.past(),
    },
  });
}

// Generate random document request with realistic email patterns
async function createRandomDocumentRequest(
  folderId: string,
  requestedDocuments: DocumentType[],
) {
  const isAccepted = Math.random() < 0.6; // 60% chance of being accepted
  const isRejected = Math.random() < 0.1; // 10% chance of being rejected
  const isCompleted = Math.random() < 0.4; // 40% chance of being completed
  const hasFirstUpload = Math.random() < 0.5; // 50% chance of having first document uploaded

  const createdAt = faker.date.past({ years: 1 });

  // Generate more realistic email addresses
  const firstName = faker.person.firstName().toLowerCase();
  const lastName = faker.person.lastName().toLowerCase();
  const emailProviders = [
    'gmail.com',
    'outlook.com',
    'yahoo.fr',
    'hotmail.com',
    'orange.fr',
    'free.fr',
  ];
  const provider = faker.helpers.arrayElement(emailProviders);

  // Create realistic email patterns
  const emailPatterns = [
    `${firstName}.${lastName}@${provider}`,
    `${firstName}${lastName}@${provider}`,
    `${firstName}${faker.number.int({ min: 10, max: 99 })}@${provider}`,
    `${firstName.charAt(0)}${lastName}@${provider}`,
  ];

  const email = faker.helpers.arrayElement(emailPatterns);

  return prisma.documentRequest.create({
    data: {
      email: email,
      requestedDocuments: {
        connect: requestedDocuments.map((doc) => ({ id: doc.id })),
      },
      folderId,
      expiresAt: addDays(createdAt, faker.number.int({ min: 14, max: 60 })),
      acceptedAt: isAccepted
        ? addHours(createdAt, faker.number.int({ min: 1, max: 48 }))
        : null,
      rejectedAt: isRejected
        ? addHours(createdAt, faker.number.int({ min: 1, max: 24 }))
        : null,
      completedAt: isCompleted
        ? addDays(createdAt, faker.number.int({ min: 1, max: 30 }))
        : null,
      firstDocumentUploadedAt: hasFirstUpload
        ? addHours(createdAt, faker.number.int({ min: 2, max: 120 }))
        : null,
      createdAt,
    },
  });
}

// Generate random share link
async function createRandomShareLink(
  requestId: string,
  requestCreatedAt: Date,
) {
  const isAccessed = Math.random() < 0.7; // 70% chance of being accessed

  return prisma.requestShareLink.create({
    data: {
      requestId,
      token: `share_${faker.string.alphanumeric(32)}`,
      expiresAt: addDays(
        requestCreatedAt,
        faker.number.int({ min: 30, max: 90 }),
      ),
      accessedAt: isAccessed
        ? addHours(requestCreatedAt, faker.number.int({ min: 1, max: 168 }))
        : null,
    },
  });
}

// Generate random document
async function createRandomDocument(
  requestId: string,
  _folderId: string,
  documentType: DocumentType,
  requestCreatedAt: Date,
) {
  const isValidated = Math.random() < 0.8; // 80% chance of validation if uploaded
  const isInvalidated = !isValidated && Math.random() < 0.3; // 30% chance of invalidation if not validated
  const hasError = Math.random() < 0.1; // 10% chance of error

  const uploadedAt = addHours(
    requestCreatedAt,
    faker.number.int({ min: 1, max: 240 }),
  );

  const errorMessages = [
    'Document illisible',
    'Format non supporté',
    'Document expiré',
    'Informations manquantes',
    'Qualité insuffisante',
  ];

  const validationErrors = hasError
    ? [faker.helpers.arrayElement(errorMessages)]
    : [];

  return prisma.document.create({
    data: {
      requestId,
      typeId: documentType.id,
      fileName: `${documentType.label.toLowerCase()}_${faker.string.alphanumeric(8)}.pdf`,
      mimeType: 'application/pdf',
      url: `https://storage.example.com/documents/${faker.string.uuid()}.pdf`,
      originalSize: faker.number.int({ min: 50000, max: 5000000 }),
      hash: faker.string.hexadecimal({ length: 64, prefix: '' }),
      DEK: generateDEK(),
      uploadedAt,
      validatedAt: isValidated
        ? addHours(uploadedAt!, faker.number.int({ min: 1, max: 48 }))
        : null,
      invalidatedAt: isInvalidated
        ? addHours(uploadedAt!, faker.number.int({ min: 1, max: 24 }))
        : null,
      errorAt: hasError
        ? addHours(uploadedAt!, faker.number.int({ min: 1, max: 12 }))
        : null,
      errorMessage: hasError ? faker.helpers.arrayElement(errorMessages) : null,
      validationErrors,
      deletedAt: Math.random() < 0.05 ? faker.date.recent() : null, // 5% chance of soft delete
    },
  });
}

// Main seeding function
async function seedDatabase(
  options: {
    folderTypesCount?: number;
    foldersPerType?: number;
    requestsPerFolder?: number;
    documentsPerRequest?: number;
  } = {},
) {
  const {
    folderTypesCount = 10,
    foldersPerType = 5,
    requestsPerFolder = 2,
    documentsPerRequest = 3,
  } = options;

  console.log('🧹 Cleaning existing data...');
  // Clean existing data in correct order (respecting foreign key constraints)
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

  // Create test users for authentication
  const { users } = await createTestUsers();

  // Ensure required document types are present before creating folder templates
  await ensureDefaultDocumentTypes();

  // Create auth test data
  await createTestSessions(users);
  await createTestEmailVerificationTokens(users);
  await createTestPasswordResetTokens(users);

  console.log('🏗️ Creating folder types...');
  const folderTypeIds = [];
  // Use the first user for all folder types
  const defaultUserId = users[0].id;
  for (let i = 0; i < folderTypesCount; i++) {
    const folderType = await createRandomFolderType(defaultUserId);
    folderTypeIds.push(folderType.id);
  }

  // Fetch folder types with their relations
  const folderTypes = await prisma.folderType.findMany({
    where: {
      id: { in: folderTypeIds },
      deletedAt: null,
    },
    include: {
      requiredDocuments: true,
    },
  });

  console.log('📁 Creating folders...');
  const folders = [];
  for (const folderType of folderTypes) {
    if (folderType.deletedAt) continue; // Skip deleted folder types

    for (let i = 0; i < foldersPerType; i++) {
      const folder = await createRandomFolder(
        folderType.id,
        folderType.requiredDocuments,
        defaultUserId,
      );
      folders.push({ folder, folderType });
    }
  }

  console.log('📋 Creating document requests...');
  const requests = [];
  for (const { folder, folderType } of folders) {
    for (let i = 0; i < requestsPerFolder; i++) {
      const request = await createRandomDocumentRequest(
        folder.id,
        folderType.requiredDocuments,
      );
      requests.push({ request, folder, folderType });

      // Create share link for each request
      await createRandomShareLink(request.id, request.createdAt);
    }
  }

  console.log('📄 Creating documents...');
  for (const { request, folder, folderType } of requests) {
    // Create documents for random subset of requested document types
    const documentsToCreate = folderType.requiredDocuments
      .sort(() => 0.5 - Math.random())
      .slice(
        0,
        Math.min(documentsPerRequest, folderType.requiredDocuments.length),
      );

    for (const docType of documentsToCreate) {
      await createRandomDocument(
        request.id,
        folder.id,
        docType,
        request.createdAt,
      );
    }
  }

  const stats = {
    users: await prisma.organization.count(),
    authProviders: await prisma.authProvider.count(),
    organizationSessions: await prisma.organizationSession.count(),
    emailVerificationTokens: await prisma.emailVerificationToken.count(),
    passwordResetTokens: await prisma.passwordResetToken.count(),
    folderTypes: await prisma.folderType.count(),
    folders: await prisma.folder.count(),
    requests: await prisma.documentRequest.count(),
    shareLinks: await prisma.requestShareLink.count(),
    documents: await prisma.document.count(),
  };

  console.log('✅ Database seeded successfully!');
  console.log('📊 Statistics:', stats);

  return stats;
}

// Export functions for use in tests
export {
  ensureDefaultDocumentTypes,
  createTestUsers,
  createTestSessions,
  createTestEmailVerificationTokens,
  createTestPasswordResetTokens,
  createRandomFolderType,
  createRandomFolder,
  createRandomDocumentRequest,
  createRandomShareLink,
  createRandomDocument,
  seedDatabase,
};

// Main execution
async function main() {
  try {
    await seedDatabase({
      folderTypesCount: 8,
      foldersPerType: 4,
      requestsPerFolder: 2,
      documentsPerRequest: 3,
    });
  } catch (error) {
    console.error('❌ Seeding failed:', error);
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
