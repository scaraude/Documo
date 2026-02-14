import type { FolderType } from '@/features/folder-types/types';
import { useRequests } from '@/features/requests/hooks/useRequests';
import { trpc } from '@/lib/trpc/client';
import { type AppDocumentType, ROUTES } from '@/shared/constants';
import {
  computeFolderStatus,
  computeRequestStatus,
} from '@/shared/utils/computedStatus';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { CreateFolderParams, Folder } from '../types';
import {
  canNavigateBack,
  generateFillFormUrl,
  generateSelectTypeUrl,
  generateSendRequestsUrl,
  getCurrentStepFromUrl,
} from '../utils/folderFormUtils';
import { useFolders } from './useFolders';

interface UseFolderFormProps {
  folderTypes?: FolderType[];
}

export const useFolderForm = ({ folderTypes }: UseFolderFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract URL parameters
  const urlParams = new URLSearchParams(searchParams?.toString() || '');
  const folderId = urlParams.get('folderId');
  const typeId = urlParams.get('typeId');
  const step = getCurrentStepFromUrl(urlParams);

  // Local state
  const [selectedType, setSelectedType] = useState<FolderType | null>(null);
  const [createdFolder, setCreatedFolder] = useState<Folder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks
  const { createFolderMutation } = useFolders();
  const { createRequestMutation } = useRequests();

  // Conditional tRPC queries
  const { data: preSelectedFolder, isLoading: isFolderLoading } =
    trpc.folder.getByIdWithRelations.useQuery(
      { id: folderId || '' },
      {
        enabled: !!folderId,
        select(folder) {
          return folder === null
            ? null
            : {
                ...folder,
                status: computeFolderStatus(folder),
                requests: folder.requests?.map((request) => ({
                  ...request,
                  status: computeRequestStatus(request),
                })),
              };
        },
      },
    );

  const { data: preSelectedFolderType, isLoading: isFolderTypeLoading } =
    trpc.folderTypes.getById.useQuery(
      { id: preSelectedFolder?.folderTypeId || '' },
      {
        enabled: !!preSelectedFolder?.folderTypeId,
      },
    );

  // Initialize state from URL parameters
  useEffect(() => {
    // Handle preselected folder (highest priority)
    if (folderId && preSelectedFolder && preSelectedFolderType) {
      setCreatedFolder(preSelectedFolder);
      setSelectedType(preSelectedFolderType);
      return;
    }

    // Handle folder not found
    if (folderId && !isFolderLoading && !preSelectedFolder) {
      toast.error('Dossier non trouvé ou accès refusé');
      router.push(ROUTES.FOLDERS.HOME);
      return;
    }

    // Handle preselected type
    if (typeId && folderTypes?.length) {
      const foundType = folderTypes.find((type) => type.id === typeId);
      if (foundType) {
        setSelectedType(foundType);
      } else {
        toast.error('Modèle de dossier non trouvé');
        router.push(ROUTES.FOLDERS.HOME);
      }
    }
  }, [
    folderId,
    typeId,
    preSelectedFolder,
    preSelectedFolderType,
    isFolderLoading,
    folderTypes,
    router,
  ]);

  // Navigation handlers
  const handleTypeSelect = (folderType: FolderType) => {
    router.push(generateFillFormUrl(folderType.id));
  };

  const handleGoBack = () => {
    if (canNavigateBack(urlParams)) {
      router.push(generateSelectTypeUrl());
    }
  };

  const handleFolderSubmit = async (data: CreateFolderParams) => {
    if (!selectedType) {
      throw new Error('No folder type selected');
    }

    setIsSubmitting(true);

    try {
      const folder = await new Promise<Folder>((resolve, reject) => {
        createFolderMutation.mutate(data, {
          onSuccess: resolve,
          onError: reject,
        });
      });

      setCreatedFolder(folder);
      router.push(generateSendRequestsUrl(folder.id));
    } catch (error) {
      toast.error('Une erreur est survenue lors de la création du dossier');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendRequests = async (emails: string[]) => {
    if (!createdFolder || !selectedType) {
      throw new Error('Missing folder or type data');
    }

    if (emails.length === 0) {
      router.push(ROUTES.FOLDERS.DETAIL(createdFolder.id));
      return;
    }

    setIsSubmitting(true);

    try {
      await Promise.all(
        emails.map((email) =>
          createRequestMutation.mutateAsync({
            email: email.trim(),
            requestedDocumentIds: selectedType.requiredDocuments.map(
              (doc) => doc.id,
            ),
            folderId: createdFolder.id,
          }),
        ),
      );

      toast.success(`${emails.length} demande(s) envoyée(s) avec succès !`);
      router.push(ROUTES.FOLDERS.DETAIL(createdFolder.id));
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi des demandes");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipRequests = () => {
    if (createdFolder) {
      router.push(ROUTES.FOLDERS.DETAIL(createdFolder.id));
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Computed values
  const canGoBack = canNavigateBack(urlParams);
  const isLoading = isSubmitting || isFolderLoading || isFolderTypeLoading;

  return {
    // State
    step,
    selectedType,
    createdFolder,
    isSubmitting,
    isLoading,
    canGoBack,

    // Handlers
    handleTypeSelect,
    handleGoBack,
    handleFolderSubmit,
    handleSendRequests,
    handleSkipRequests,
    handleCancel,
  };
};
