// app/folder-types/[id]/page.tsx
'use client'
import { useParams, useRouter } from 'next/navigation';
import { useFolderTypes } from '@/features/folder-types';
import { FolderTypeDetail } from '@/features/folder-types/components/FolderTypeDetail';
import { ROUTES } from '@/shared/constants';
import { toast } from 'sonner';

export default function FolderTypeDetailPage() {
    const { id: folderTypeId }: { id: string } = useParams();
    const router = useRouter();
    const { getFolderTypeById, deleteFolderType } = useFolderTypes();
    const { data: folderType, isLoading } = getFolderTypeById(folderTypeId);

    const handleDelete = async (id: string) => {
        try {
            await deleteFolderType(id);
            router.push(ROUTES.FOLDERS.HOME);
        } catch {
            toast.error("Impossible de supprimer le type de dossier");
        }
    };

    if (isLoading && !folderType) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!folderType && !isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                <p>Type de dossier introuvable</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {folderType && (
                <FolderTypeDetail
                    folderType={folderType}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}