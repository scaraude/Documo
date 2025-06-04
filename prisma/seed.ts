import { PrismaClient, DocumentType } from '../lib/prisma/generated/client';
import { addDays } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
    // Suppression des données existantes
    await prisma.document.deleteMany({});
    await prisma.folder.deleteMany({});
    await prisma.requestShareLink.deleteMany({});
    await prisma.folderType.deleteMany({});
    await prisma.documentRequest.deleteMany({});
    // Création des types de dossiers
    const dossierLocationResidence = await prisma.folderType.create({
        data: {
            name: 'Dossier Location Résidence Principale',
            description: 'Documents requis pour une demande de location d\'appartement ou maison',
            requiredDocuments: [
                DocumentType.IDENTITY_CARD,
                DocumentType.BANK_STATEMENT,
                DocumentType.UTILITY_BILL
            ],
            customFields: JSON.stringify([
                { name: 'revenuMensuel', type: 'number', required: true, label: 'Revenu mensuel net' },
                { name: 'profession', type: 'text', required: true, label: 'Profession' },
                { name: 'employeur', type: 'text', required: true, label: 'Nom de l\'employeur' }
            ])
        }
    });

    const dossierLocationCommercial = await prisma.folderType.create({
        data: {
            name: 'Dossier Location Commercial',
            description: 'Documents requis pour une demande de location de local commercial',
            requiredDocuments: [
                DocumentType.IDENTITY_CARD,
                DocumentType.BANK_STATEMENT,
                DocumentType.OTHER
            ],
            customFields: JSON.stringify([
                { name: 'societe', type: 'text', required: true, label: 'Nom de la société' },
                { name: 'siret', type: 'text', required: true, label: 'Numéro SIRET' },
                { name: 'activite', type: 'text', required: true, label: 'Type d\'activité' }
            ])
        }
    });

    const dossierAchatResidence = await prisma.folderType.create({
        data: {
            name: 'Dossier Achat Résidence',
            description: 'Documents requis pour l\'achat d\'un bien immobilier',
            requiredDocuments: [
                DocumentType.IDENTITY_CARD,
                DocumentType.BANK_STATEMENT,
                DocumentType.OTHER
            ],
            customFields: JSON.stringify([
                { name: 'montantPret', type: 'number', required: true, label: 'Montant du prêt souhaité' },
                { name: 'apport', type: 'number', required: true, label: 'Apport personnel' },
                { name: 'banque', type: 'text', required: false, label: 'Banque pressentie' }
            ])
        }
    });

    const dossierInvestissement = await prisma.folderType.create({
        data: {
            name: 'Dossier Investissement Locatif',
            description: 'Documents requis pour un investissement locatif',
            requiredDocuments: [
                DocumentType.IDENTITY_CARD,
                DocumentType.BANK_STATEMENT,
                DocumentType.OTHER
            ],
            customFields: JSON.stringify([
                { name: 'typeInvestissement', type: 'text', required: true, label: 'Type d\'investissement' },
                { name: 'montantInvestissement', type: 'number', required: true, label: 'Montant d\'investissement prévu' },
                { name: 'dispositifFiscal', type: 'text', required: false, label: 'Dispositif fiscal souhaité' }
            ])
        }
    });

    // Création des dossiers
    const dossiers = [
        {
            name: 'Location Studio Paris 15',
            description: 'Dossier de location pour studio 25m² - Rue de Vaugirard',
            folderType: dossierLocationResidence,
            customFieldsData: {
                revenuMensuel: 3200,
                profession: 'Développeur Web',
                employeur: 'Tech Solutions SAS'
            },
            email: 'thomas.martin@email.fr'
        },
        {
            name: 'Location Local Commercial Lyon',
            description: 'Local commercial 80m² - Rue de la République',
            folderType: dossierLocationCommercial,
            customFieldsData: {
                societe: 'Boulangerie Artisanale SARL',
                siret: '12345678900001',
                activite: 'Boulangerie-Pâtisserie'
            },
            email: 'dupont.boulangerie@email.fr'
        },
        {
            name: 'Achat Appartement Bordeaux',
            description: 'Achat T3 - Quartier des Chartrons',
            folderType: dossierAchatResidence,
            customFieldsData: {
                montantPret: 320000,
                apport: 80000,
                banque: 'Crédit Mutuel'
            },
            email: 'sophie.dubois@email.fr'
        },
        {
            name: 'Location T2 Nantes',
            description: 'Location T2 45m² - Île de Nantes',
            folderType: dossierLocationResidence,
            customFieldsData: {
                revenuMensuel: 2800,
                profession: 'Infirmière',
                employeur: 'CHU de Nantes'
            },
            email: 'marie.leroux@email.fr'
        },
        {
            name: 'Investissement Pinel Toulouse',
            description: 'Investissement T3 neuf - Quartier Compans',
            folderType: dossierInvestissement,
            customFieldsData: {
                typeInvestissement: 'Pinel',
                montantInvestissement: 250000,
                dispositifFiscal: 'Pinel 2025'
            },
            email: 'pierre.investisseur@email.fr'
        },
        {
            name: 'Location Commerce Marseille',
            description: 'Local 120m² - Vieux Port',
            folderType: dossierLocationCommercial,
            customFieldsData: {
                societe: 'Restaurant Le Mistral',
                siret: '98765432100001',
                activite: 'Restaurant'
            },
            email: 'restaurant.mistral@email.fr'
        },
        {
            name: 'Achat Maison Rennes',
            description: 'Maison 150m² - Quartier Thabor',
            folderType: dossierAchatResidence,
            customFieldsData: {
                montantPret: 450000,
                apport: 150000,
                banque: 'BNP Paribas'
            },
            email: 'famille.bernard@email.fr'
        },
        {
            name: 'Location Studio Nice',
            description: 'Studio vue mer 30m² - Promenade des Anglais',
            folderType: dossierLocationResidence,
            customFieldsData: {
                revenuMensuel: 2500,
                profession: 'Commercial',
                employeur: 'Azur Distribution'
            },
            email: 'julie.petit@email.fr'
        },
        {
            name: 'Investissement SCPI',
            description: 'Parts de SCPI Bureau Europe',
            folderType: dossierInvestissement,
            customFieldsData: {
                typeInvestissement: 'SCPI',
                montantInvestissement: 100000,
                dispositifFiscal: 'Régime général'
            },
            email: 'michel.investor@email.fr'
        },
        {
            name: 'Location Commerce Lille',
            description: 'Boutique 60m² - Vieux Lille',
            folderType: dossierLocationCommercial,
            customFieldsData: {
                societe: 'Mode Vintage SARL',
                siret: '45678912300001',
                activite: 'Prêt-à-porter'
            },
            email: 'vintage.mode@email.fr'
        },
        {
            name: 'Achat Loft Montpellier',
            description: 'Loft 120m² - Quartier Antigone',
            folderType: dossierAchatResidence,
            customFieldsData: {
                montantPret: 380000,
                apport: 95000,
                banque: 'Société Générale'
            },
            email: 'lucas.robert@email.fr'
        },
        {
            name: 'Location T3 Strasbourg',
            description: 'T3 70m² - Grande Île',
            folderType: dossierLocationResidence,
            customFieldsData: {
                revenuMensuel: 3500,
                profession: 'Architecte',
                employeur: 'Cabinet Alsace Design'
            },
            email: 'emma.schmitt@email.fr'
        }
    ];

    // Création des dossiers et des demandes de documents associées
    for (const dossier of dossiers) {
        const folder = await prisma.folder.create({
            data: {
                name: dossier.name,
                description: dossier.description,
                folderTypeId: dossier.folderType.id,
                requestedDocuments: dossier.folderType.requiredDocuments,
                customFieldsData: dossier.customFieldsData,
                createdById: 'system_seed',
            }
        });

        // Création d'une demande de documents pour chaque dossier
        const request = await prisma.documentRequest.create({
            data: {
                civilId: dossier.email,
                requestedDocuments: dossier.folderType.requiredDocuments,
                folderId: folder.id,
                expiresAt: addDays(new Date(), 30),
            }
        });

        // Création d'un lien de partage pour la demande
        await prisma.requestShareLink.create({
            data: {
                requestId: request.id,
                token: `token_${request.id}`,
                expiresAt: addDays(new Date(), 30),
            }
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
