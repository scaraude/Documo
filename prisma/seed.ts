/**
 * Database Seeding Script
 * 
 * This script seeds the database with realistic test data for the Document Transfer App.
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

import { PrismaClient, DocumentType, ProviderType } from '../lib/prisma/generated/client';
import { addDays, addHours } from 'date-fns';
import { faker } from '@faker-js/faker';
import * as crypto from 'crypto';
import { hashPassword } from '../features/auth/utils/password';

const prisma = new PrismaClient();


// Helper function to get random subset of document types
function getRandomDocumentTypes(min = 1, max = 4): DocumentType[] {
    const allTypes = Object.values(DocumentType);
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...allTypes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Helper function to generate random DEK
function generateDEK(): string {
    return crypto.randomBytes(32).toString('base64');
}

// Test user data configuration
export const TEST_USERS = {
    verified: {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        initials: 'TU'
    },
    unverified: {
        email: 'unverified@example.com',
        password: 'password123',
        firstName: 'Unverified',
        lastName: 'User',
        initials: 'UU'
    }
} as const;

// Create test users for authentication testing
async function createTestUsers() {
    console.log('👤 Creating test users...');
    
    // Create a verified test user
    const testUser = await prisma.user.create({
        data: {
            email: TEST_USERS.verified.email,
            firstName: TEST_USERS.verified.firstName,
            lastName: TEST_USERS.verified.lastName,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    });

    await prisma.authProvider.create({
        data: {
            userId: testUser.id,
            providerType: ProviderType.EMAIL_PASSWORD,
            providerId: TEST_USERS.verified.email,
            passwordHash: await hashPassword(TEST_USERS.verified.password),
            isVerified: true,
            emailVerifiedAt: new Date(),
        }
    });

    // Create an unverified test user
    const unverifiedUser = await prisma.user.create({
        data: {
            email: TEST_USERS.unverified.email,
            firstName: TEST_USERS.unverified.firstName,
            lastName: TEST_USERS.unverified.lastName,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    });

    await prisma.authProvider.create({
        data: {
            userId: unverifiedUser.id,
            providerType: ProviderType.EMAIL_PASSWORD,
            providerId: TEST_USERS.unverified.email,
            passwordHash: await hashPassword(TEST_USERS.unverified.password),
            isVerified: false,
            emailVerifiedAt: null,
        }
    });

    console.log('✅ Test users created successfully');
    return { testUser, unverifiedUser };
}

// Generate random folder type
async function createRandomFolderType() {
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
        'Dossier Caution Solidaire'
    ];

    const descriptions = [
        'Documents requis pour une demande de location d\'appartement ou maison',
        'Documents requis pour une demande de location de local commercial',
        'Documents requis pour l\'achat d\'un bien immobilier',
        'Documents requis pour un investissement locatif',
        'Documents requis pour une demande de prêt immobilier',
        'Documents requis pour une location saisonnière',
        'Documents requis pour la vente d\'un bien immobilier',
        'Documents requis pour un refinancement',
        'Documents requis pour une assurance habitation',
        'Documents requis pour se porter caution solidaire'
    ];

    const name = faker.helpers.arrayElement(folderTypeNames);
    const description = faker.helpers.arrayElement(descriptions);
    const requiredDocuments = getRandomDocumentTypes(2, 5);

    return prisma.folderType.create({
        data: {
            name,
            description,
            requiredDocuments,
            createdById: null, // Skip user creation for seeding
            deletedAt: Math.random() < 0.1 ? faker.date.past() : null, // 10% chance of soft delete
        }
    });
}

// Generate random folder
async function createRandomFolder(folderTypeId: string, folderTypeRequiredDocs: DocumentType[]) {
    const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes'];
    const propertyTypes = ['Studio', 'T2', 'T3', 'T4', 'Maison', 'Loft', 'Local Commercial', 'Bureau'];

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
            requestedDocuments: folderTypeRequiredDocs,
            createdById: null, // Skip user creation for seeding
            expiresAt: Math.random() < 0.7 ? addDays(new Date(), faker.number.int({ min: 7, max: 90 })) : null,
            completedAt: isCompleted ? faker.date.past() : null,
            archivedAt: isArchived ? faker.date.past() : null,
            lastActivityAt: hasActivity ? faker.date.recent({ days: 7 }) : faker.date.past(),
        }
    });
}

// Generate random document request with realistic email patterns
async function createRandomDocumentRequest(folderId: string, requestedDocuments: DocumentType[]) {
    const isAccepted = Math.random() < 0.6; // 60% chance of being accepted
    const isRejected = Math.random() < 0.1; // 10% chance of being rejected
    const isCompleted = Math.random() < 0.4; // 40% chance of being completed
    const hasFirstUpload = Math.random() < 0.5; // 50% chance of having first document uploaded

    const createdAt = faker.date.past({ years: 1 });

    // Generate more realistic email addresses
    const firstName = faker.person.firstName().toLowerCase();
    const lastName = faker.person.lastName().toLowerCase();
    const emailProviders = ['gmail.com', 'outlook.com', 'yahoo.fr', 'hotmail.com', 'orange.fr', 'free.fr'];
    const provider = faker.helpers.arrayElement(emailProviders);

    // Create realistic email patterns
    const emailPatterns = [
        `${firstName}.${lastName}@${provider}`,
        `${firstName}${lastName}@${provider}`,
        `${firstName}${faker.number.int({ min: 10, max: 99 })}@${provider}`,
        `${firstName.charAt(0)}${lastName}@${provider}`
    ];

    const email = faker.helpers.arrayElement(emailPatterns);

    return prisma.documentRequest.create({
        data: {
            email: email,
            requestedDocuments,
            folderId,
            expiresAt: addDays(createdAt, faker.number.int({ min: 14, max: 60 })),
            acceptedAt: isAccepted ? addHours(createdAt, faker.number.int({ min: 1, max: 48 })) : null,
            rejectedAt: isRejected ? addHours(createdAt, faker.number.int({ min: 1, max: 24 })) : null,
            completedAt: isCompleted ? addDays(createdAt, faker.number.int({ min: 1, max: 30 })) : null,
            firstDocumentUploadedAt: hasFirstUpload ? addHours(createdAt, faker.number.int({ min: 2, max: 120 })) : null,
            createdAt,
        }
    });
}

// Generate random share link
async function createRandomShareLink(requestId: string, requestCreatedAt: Date) {
    const isAccessed = Math.random() < 0.7; // 70% chance of being accessed

    return prisma.requestShareLink.create({
        data: {
            requestId,
            token: `share_${faker.string.alphanumeric(32)}`,
            expiresAt: addDays(requestCreatedAt, faker.number.int({ min: 30, max: 90 })),
            accessedAt: isAccessed ? addHours(requestCreatedAt, faker.number.int({ min: 1, max: 168 })) : null,
        }
    });
}

// Generate random document
async function createRandomDocument(requestId: string, folderId: string, documentType: DocumentType, requestCreatedAt: Date) {
    const isValidated = Math.random() < 0.8; // 80% chance of validation if uploaded
    const isInvalidated = !isValidated && Math.random() < 0.3; // 30% chance of invalidation if not validated
    const hasError = Math.random() < 0.1; // 10% chance of error

    const uploadedAt = addHours(requestCreatedAt, faker.number.int({ min: 1, max: 240 }));

    const errorMessages = [
        'Document illisible',
        'Format non supporté',
        'Document expiré',
        'Informations manquantes',
        'Qualité insuffisante'
    ];

    const validationErrors = hasError ? [faker.helpers.arrayElement(errorMessages)] : [];

    return prisma.document.create({
        data: {
            requestId,
            type: documentType,
            fileName: `${documentType.toLowerCase()}_${faker.string.alphanumeric(8)}.pdf`,
            mimeType: 'application/pdf',
            url: `https://storage.example.com/documents/${faker.string.uuid()}.pdf`,
            originalSize: faker.number.int({ min: 50000, max: 5000000 }),
            hash: faker.string.hexadecimal({ length: 64, prefix: '' }),
            DEK: generateDEK(),
            uploadedAt,
            validatedAt: isValidated ? addHours(uploadedAt!, faker.number.int({ min: 1, max: 48 })) : null,
            invalidatedAt: isInvalidated ? addHours(uploadedAt!, faker.number.int({ min: 1, max: 24 })) : null,
            errorAt: hasError ? addHours(uploadedAt!, faker.number.int({ min: 1, max: 12 })) : null,
            errorMessage: hasError ? faker.helpers.arrayElement(errorMessages) : null,
            validationErrors,
            deletedAt: Math.random() < 0.05 ? faker.date.recent() : null, // 5% chance of soft delete
        }
    });
}

// Main seeding function
async function seedDatabase(options: {
    folderTypesCount?: number;
    foldersPerType?: number;
    requestsPerFolder?: number;
    documentsPerRequest?: number;
} = {}) {
    const {
        folderTypesCount = 10,
        foldersPerType = 5,
        requestsPerFolder = 2,
        documentsPerRequest = 3
    } = options;

    console.log('🧹 Cleaning existing data...');
    // Clean existing data in correct order (respecting foreign key constraints)
    await prisma.document.deleteMany({});
    await prisma.requestShareLink.deleteMany({});
    await prisma.documentRequest.deleteMany({});
    await prisma.folder.deleteMany({});
    await prisma.folderType.deleteMany({});
    await prisma.emailVerificationToken.deleteMany({});
    await prisma.userSession.deleteMany({});
    await prisma.authProvider.deleteMany({});
    await prisma.user.deleteMany({});

    // Create test users for authentication
    await createTestUsers();

    console.log('🏗️ Creating folder types...');
    const folderTypes = [];
    for (let i = 0; i < folderTypesCount; i++) {
        const folderType = await createRandomFolderType();
        folderTypes.push(folderType);
    }

    console.log('📁 Creating folders...');
    const folders = [];
    for (const folderType of folderTypes) {
        if (folderType.deletedAt) continue; // Skip deleted folder types

        for (let i = 0; i < foldersPerType; i++) {
            const folder = await createRandomFolder(folderType.id, folderType.requiredDocuments);
            folders.push({ folder, folderType });
        }
    }

    console.log('📋 Creating document requests...');
    const requests = [];
    for (const { folder, folderType } of folders) {
        for (let i = 0; i < requestsPerFolder; i++) {
            const request = await createRandomDocumentRequest(folder.id, folderType.requiredDocuments);
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
            .slice(0, Math.min(documentsPerRequest, folderType.requiredDocuments.length));

        for (const docType of documentsToCreate) {
            await createRandomDocument(request.id, folder.id, docType, request.createdAt);
        }
    }

    const stats = {
        users: await prisma.user.count(),
        authProviders: await prisma.authProvider.count(),
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
    createTestUsers,
    createRandomFolderType,
    createRandomFolder,
    createRandomDocumentRequest,
    createRandomShareLink,
    createRandomDocument,
    seedDatabase
};

// Main execution
async function main() {
    try {
        await seedDatabase({
            folderTypesCount: 8,
            foldersPerType: 4,
            requestsPerFolder: 2,
            documentsPerRequest: 3
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