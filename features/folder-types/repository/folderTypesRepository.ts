import { AppDocumentType } from "@/shared/constants";
import { CustomField, FolderType } from "../types";
import prisma, { Prisma } from '@/lib/prisma';

type PrismaFolderType = Prisma.FolderTypeGetPayload<null>;

const toAppModel = (prismaModel: PrismaFolderType): FolderType => {
    return {
        id: prismaModel.id,
        name: prismaModel.name,
        description: prismaModel.description || '',
        createdAt: prismaModel.createdAt,
        updatedAt: prismaModel.updatedAt,
        requiredDocuments: prismaModel.requiredDocuments as AppDocumentType[],
        customFields: prismaModel.customFields as unknown as CustomField[],
    };
}

/**
 * Get all folder types
 */
export async function getFolderType(): Promise<FolderType[]> {
    try {
        const folderType = await prisma.folderType.findMany();
        return folderType.map(toAppModel);
    } catch (error) {
        console.error('Error fetching folderType from database:', error);
        throw new Error('Failed to fetch folderType');
    }
}