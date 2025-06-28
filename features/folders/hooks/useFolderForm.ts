import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FolderType } from '@/features/folder-types/types';
import { CreateFolderParams, Folder } from '../types';
import { useFolders } from './useFolders';
import { useRequests } from '@/features/requests/hooks/useRequests';
import { useFolderTypes } from '@/features/folder-types';
import { ROUTES, AppDocumentType } from '@/shared/constants';
import { toast } from 'sonner';
import {
  getPreselectedFolderId,
  getPreselectedFolderTypeId,
  hasPreselectedFolder,
  hasPreselectedFolderType,
  getCurrentStepFromUrl,
  generateFillFormUrl,
  generateSendRequestsUrl,
  generateSelectTypeUrl,
  canNavigateBack,
} from '../utils/folderFormUtils';

interface UseFolderFormProps {
  folderTypes?: FolderType[];
}

export const useFolderForm = ({ folderTypes }: UseFolderFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Use utility functions to extract URL parameters
  const searchParamsObj = searchParams
    ? new URLSearchParams(searchParams.toString())
    : new URLSearchParams();
  const preSelectedTypeId = getPreselectedFolderTypeId(searchParamsObj);
  const preSelectedFolderId = getPreselectedFolderId(searchParamsObj);
  const hasPreselectedFolderParam = hasPreselectedFolder(searchParamsObj);
  const hasPreselectedFolderTypeParam =
    hasPreselectedFolderType(searchParamsObj);

  const { createFolderMutation, getFolderById } = useFolders();
  const { createRequestMutation } = useRequests();
  const { getFolderTypeById } = useFolderTypes();

  // Derive step from URL instead of local state
  const step = getCurrentStepFromUrl(searchParamsObj);
  const [selectedType, setSelectedType] = useState<FolderType | null>(null);
  const [createdFolder, setCreatedFolder] = useState<Folder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Fetch preselected folder data if folderId is provided
  const preSelectedFolderQuery = getFolderById(preSelectedFolderId || '');
  const { data: preSelectedFolder, isLoading: isFolderLoading } = {
    ...preSelectedFolderQuery,
    data: preSelectedFolderId ? preSelectedFolderQuery.data : undefined,
    isLoading: preSelectedFolderId ? preSelectedFolderQuery.isLoading : false,
  };

  // Fetch folder type for preselected folder
  const preSelectedFolderTypeQuery = getFolderTypeById(
    preSelectedFolder?.folderTypeId || ''
  );
  const { data: preSelectedFolderType, isLoading: isFolderTypeLoading } = {
    ...preSelectedFolderTypeQuery,
    data: preSelectedFolder?.folderTypeId
      ? preSelectedFolderTypeQuery.data
      : undefined,
    isLoading: preSelectedFolder?.folderTypeId
      ? preSelectedFolderTypeQuery.isLoading
      : false,
  };

  // Handle pre-selected folder from query params (priority over typeId)
  useEffect(() => {
    // Handle folder preselection (highest priority)
    if (hasPreselectedFolderParam) {
      if (preSelectedFolder && preSelectedFolderType) {
        setIsInitializing(true);
        setCreatedFolder(preSelectedFolder);
        setSelectedType(preSelectedFolderType);
        setIsInitializing(false);
        return;
      } else if (
        !isFolderLoading &&
        !isFolderTypeLoading &&
        preSelectedFolderId
      ) {
        // Folder or folder type not found/accessible
        toast.error('Dossier non trouvé ou accès refusé');
        router.push(ROUTES.FOLDERS.HOME);
        return;
      }
    }

    // Fallback to pre-selected type if no folder is specified
    if (
      hasPreselectedFolderTypeParam &&
      preSelectedTypeId &&
      folderTypes &&
      folderTypes.length > 0
    ) {
      const foundType = folderTypes.find(type => type.id === preSelectedTypeId);
      if (foundType) {
        setSelectedType(foundType);
      } else {
        // Folder type not found
        toast.error('Type de dossier non trouvé');
        router.push(ROUTES.FOLDERS.HOME);
      }
    }
  }, [
    hasPreselectedFolderParam,
    preSelectedFolderId,
    preSelectedFolder,
    preSelectedFolderType,
    isFolderLoading,
    isFolderTypeLoading,
    hasPreselectedFolderTypeParam,
    preSelectedTypeId,
    folderTypes,
    router,
  ]);

  const handleTypeSelect = (folderType: FolderType) => {
    // Navigate to fillForm step with selected type
    router.push(generateFillFormUrl(folderType.id));
  };

  const handleGoBack = () => {
    if (canNavigateBack(searchParamsObj)) {
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
      toast.success('Dossier créé avec succès !');
      // Navigate to sendRequests step with created folder
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
      // No requests to send, go directly to folder
      router.push(ROUTES.FOLDERS.DETAIL(createdFolder.id));
      return;
    }

    setIsSubmitting(true);

    try {
      await Promise.all(
        emails.map(email =>
          createRequestMutation.mutateAsync({
            email: email.trim(),
            requestedDocuments: selectedType.requiredDocuments.map(
              doc => doc.id as AppDocumentType
            ),
            folderId: createdFolder.id,
          })
        )
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

  const canGoBack = canNavigateBack(searchParamsObj);
  const isLoading =
    isSubmitting || isFolderLoading || isFolderTypeLoading || isInitializing;

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
