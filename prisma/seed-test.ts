import { PrismaClient } from '../lib/prisma/generated/client';
import {
    createRandomFolderType,
    createRandomFolder,
    createRandomDocumentRequest,
    createRandomShareLink,
    createRandomDocument
} from './seed';

const prisma = new PrismaClient();

// Lightweight test seeding function
export async function seedTestData() {
    console.log('🧹 Cleaning test data...');
    await cleanTestData();

    console.log('🏗️ Creating test data...');

    // Create minimal test data
    const folderType = await createRandomFolderType();
    const folder = await createRandomFolder(folderType.id, folderType.requiredDocuments);
    const request = await createRandomDocumentRequest(folder.id, folderType.requiredDocuments);
    const shareLink = await createRandomShareLink(request.id, request.createdAt);

    // Create a document for each required document type
    const documents = [];
    for (const docType of folderType.requiredDocuments.slice(0, 2)) {
        const document = await createRandomDocument(request.id, folder.id, docType, request.createdAt);
        documents.push(document);
    }

    const testData = {
        folderType,
        folder,
        request,
        shareLink,
        documents,
        stats: {
            folderTypes: 1,
            folders: 1,
            requests: 1,
            shareLinks: 1,
            documents: documents.length
        }
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