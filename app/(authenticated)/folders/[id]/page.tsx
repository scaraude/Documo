// app/folders/[id]/page.tsx
'use client';
import { useFolders } from '@/features/folders';
import { FolderDetail } from '@/features/folders/components/FolderDetail';
import { ROUTES } from '@/shared/constants';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function FolderDetailPage() {
  const { id: folderId }: { id: string } = useParams();
  const router = useRouter();
  const {
    getFolderById,
    deleteFolderMutation,
    removeRequestFromFolderMutation,
  } = useFolders();
  const { data: folder, isLoading } = getFolderById(folderId);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      deleteFolderMutation.mutate({ id });
      router.push(ROUTES.FOLDERS.HOME);
    } catch {
      toast.error('Impossible de supprimer le dossier');
      setError('Impossible de supprimer le dossier');
    }
  };

  const handleRemoveRequest = async (_folderId: string, requestId: string) => {
    try {
      removeRequestFromFolderMutation.mutate({ requestId });
    } catch {
      toast.error('Impossible de retirer la demande du dossier');
      setError('Impossible de retirer la demande du dossier');
    }
  };

  if (isLoading && !folder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!folder && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>Dossier introuvable</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {folder && (
        <FolderDetail
          folder={folder}
          onDelete={handleDelete}
          onRemoveRequest={handleRemoveRequest}
        />
      )}
    </div>
  );
}
