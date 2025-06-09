import { PrismaClient, DocumentType } from '../lib/prisma/generated/client';
import { addDays } from 'date-fns';

const prisma = new PrismaClient();

export async function seedTestData() {
    // Clean existing test data
    await prisma.requestShareLink.deleteMany({});
    await prisma.document.deleteMany({});
    await prisma.documentRequest.deleteMany({});
    await prisma.folder.deleteMany({});
    await prisma.folderType.deleteMany({});

    // Create test folder types
    const testFolderType = await prisma.folderType.create({
        data: {
            name: 'Test Document Request Type',
            description: 'Folder type for integration testing',
            requiredDocuments: [
                DocumentType.IDENTITY_CARD,
                DocumentType.BANK_STATEMENT,
                DocumentType.UTILITY_BILL
            ],
        }
    });

    const expiredFolderType = await prisma.folderType.create({
        data: {
            name: 'Expired Document Request Type',
            description: 'Folder type for testing expired requests',
            requiredDocuments: [
                DocumentType.IDENTITY_CARD,
                DocumentType.PASSPORT
            ],
        }
    });

    // Create test folders
    const testFolder = await prisma.folder.create({
        data: {
            name: 'Test Integration Folder',
            description: 'Folder for integration testing',
            folderTypeId: testFolderType.id,
            requestedDocuments: testFolderType.requiredDocuments,
            createdById: 'test_user',
        }
    });

    const expiredFolder = await prisma.folder.create({
        data: {
            name: 'Expired Test Folder',
            description: 'Folder for testing expired scenarios',
            folderTypeId: expiredFolderType.id,
            requestedDocuments: expiredFolderType.requiredDocuments,
            createdById: 'test_user',
        }
    });

    // Create test document requests
    const validRequest = await prisma.documentRequest.create({
        data: {
            civilId: 'test-civil-valid@example.com',
            requestedDocuments: [DocumentType.IDENTITY_CARD, DocumentType.BANK_STATEMENT],
            folderId: testFolder.id,
            expiresAt: addDays(new Date(), 30),
        }
    });

    const expiredRequest = await prisma.documentRequest.create({
        data: {
            civilId: 'test-civil-expired@example.com',
            requestedDocuments: [DocumentType.IDENTITY_CARD, DocumentType.PASSPORT],
            folderId: expiredFolder.id,
            expiresAt: addDays(new Date(), -1), // Expired yesterday
        }
    });

    const completedRequest = await prisma.documentRequest.create({
        data: {
            civilId: 'test-civil-completed@example.com',
            requestedDocuments: [DocumentType.IDENTITY_CARD],
            folderId: testFolder.id,
            expiresAt: addDays(new Date(), 15),
            completedAt: new Date(),
        }
    });

    // Create test share links
    const validShareLink = await prisma.requestShareLink.create({
        data: {
            requestId: validRequest.id,
            token: 'test-valid-token-123',
            expiresAt: addDays(new Date(), 30),
        }
    });

    const expiredShareLink = await prisma.requestShareLink.create({
        data: {
            requestId: expiredRequest.id,
            token: 'test-expired-token-456',
            expiresAt: addDays(new Date(), -1), // Expired yesterday
        }
    });

    const completedShareLink = await prisma.requestShareLink.create({
        data: {
            requestId: completedRequest.id,
            token: 'test-completed-token-789',
            expiresAt: addDays(new Date(), 15),
        }
    });

    // Create some test documents
    await prisma.document.create({
        data: {
            requestId: completedRequest.id,
            folderId: testFolder.id,
            type: DocumentType.IDENTITY_CARD,
            metadata: { fileName: 'test-id-card.pdf', size: 1024 },
            url: 'https://example.com/test-id-card.pdf',
            hash: 'test-hash-123',
            DEK: 'test-encryption-key',
            uploadedAt: new Date(),
            validatedAt: new Date(),
        }
    });

    return {
        folderTypes: {
            testFolderType,
            expiredFolderType,
        },
        folders: {
            testFolder,
            expiredFolder,
        },
        requests: {
            validRequest,
            expiredRequest,
            completedRequest,
        },
        shareLinks: {
            validShareLink,
            expiredShareLink,
            completedShareLink,
        }
    };
}

// Run seed if called directly
if (require.main === module) {
    seedTestData()
        .then(() => {
            console.log('Test data seeded successfully');
        })
        .catch((e) => {
            console.error('Error seeding test data:', e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}