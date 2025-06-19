import { PrismaClient } from '../lib/prisma/generated/client';

const prisma = new PrismaClient();

const documentTypes = [
  {
    id: 'IDENTITY_PROOF',
    label: "Justificatif d'identité",
    description: 'CNI, passeport ou titre de séjour',
    acceptedFormats: ['pdf', 'jpg', 'jpeg', 'png'],
    maxSizeMB: 5,
  },
  {
    id: 'DRIVERS_LICENSE',
    label: 'Permis de conduire',
    description: 'Permis de conduire français',
    acceptedFormats: ['pdf', 'jpg', 'jpeg', 'png'],
    maxSizeMB: 5,
  },
  {
    id: 'BANK_STATEMENT',
    label: "RIB - Relevé d'identité bancaire",
    description: "Relevé d'identité bancaire ou attestation bancaire",
    acceptedFormats: ['pdf'],
    maxSizeMB: 5,
  },
  {
    id: 'RESIDENCY_PROOF',
    label: 'Justificatif de domicile',
    description: "Facture d'électricité, gaz, eau ou téléphone",
    acceptedFormats: ['pdf', 'jpg', 'jpeg', 'png'],
  },
  {
    id: 'TAX_RETURN',
    label: "Avis d'imposition",
    description: "Avis d'imposition sur le revenu",
    acceptedFormats: ['pdf'],
    maxSizeMB: 10,
  },
  {
    id: 'EMPLOYMENT_CONTRACT',
    label: 'Contrat de travail',
    description: 'Contrat de travail ou attestation employeur',
    acceptedFormats: ['pdf'],
    maxSizeMB: 10,
  },
  {
    id: 'SALARY_SLIP',
    label: 'Bulletin de salaire',
    description: 'Bulletin de paie récent',
    acceptedFormats: ['pdf'],
    maxSizeMB: 5,
  },
  {
    id: 'INSURANCE_CERTIFICATE',
    label: "Attestation d'assurance",
    description: "Attestation d'assurance habitation ou automobile",
    acceptedFormats: ['pdf'],
    maxSizeMB: 5,
  },
  {
    id: 'OTHER',
    label: 'Autre',
    description: 'Autre type de document',
    acceptedFormats: ['pdf', 'jpg', 'jpeg', 'png'],
    maxSizeMB: 10,
  },
];

async function seedDocumentTypes() {
  console.log('🌱 Seeding document types...');

  for (const documentType of documentTypes) {
    await prisma.documentType.upsert({
      where: { id: documentType.id },
      update: documentType,
      create: documentType,
    });
  }

  console.log('✅ Document types seeded successfully!');
}

async function main() {
  try {
    await seedDocumentTypes();
  } catch (error) {
    console.error('❌ Error seeding document types:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { seedDocumentTypes };
