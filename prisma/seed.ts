import { PrismaClient } from '@prisma/client';

// Define DocumentType enum locally if not exported by @prisma/client
enum DocumentType {
    IDENTITY_CARD = 'IDENTITY_CARD',
    PASSPORT = 'PASSPORT',
    BANK_STATEMENT = 'BANK_STATEMENT',
    UTILITY_BILL = 'UTILITY_BILL'
}

const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);

    // Create request templates
    const identityTemplate = await prisma.requestTemplate.create({
        data: {
            title: 'Identity Documents',
            requestedDocuments: [DocumentType.IDENTITY_CARD, DocumentType.PASSPORT]
        },
    });

    const financialTemplate = await prisma.requestTemplate.create({
        data: {
            title: 'Financial Documents',
            requestedDocuments: [DocumentType.BANK_STATEMENT, DocumentType.UTILITY_BILL]
        },
    });

    const rentalTemplate = await prisma.requestTemplate.create({
        data: {
            title: 'Rental Application',
            requestedDocuments: [
                DocumentType.IDENTITY_CARD,
                DocumentType.BANK_STATEMENT,
                DocumentType.UTILITY_BILL
            ]
        },
    });

    console.log(`Created templates with IDs: 
    - ${identityTemplate.id} (${identityTemplate.title})
    - ${financialTemplate.id} (${financialTemplate.title})
    - ${rentalTemplate.id} (${rentalTemplate.title})
  `);

    // Create a sample request
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // Expires in 7 days

    const documentRequest = await prisma.documentRequest.create({
        data: {
            civilId: '123456789',
            requestedDocuments: [DocumentType.IDENTITY_CARD, DocumentType.UTILITY_BILL],
            status: 'PENDING',
            expiresAt: expirationDate,
        },
    });

    console.log(`Created sample request with ID: ${documentRequest.id}`);

    console.log(`Seeding finished.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });