import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FolderType } from '@/features/folder-types/types';
import { CreateFolderParams, Folder } from '../types';
import { useFolders } from './useFolders';
import { useRequests } from '@/features/requests/hooks/useRequests';
import { ROUTES, AppDocumentType } from '@/shared/constants';
import { toast } from 'sonner';
import { FolderFormStep } from '../components/StepIndicator';

interface UseFolderFormProps {
  folderTypes?: FolderType[];
}

export const useFolderForm = ({ folderTypes }: UseFolderFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedTypeId = searchParams?.get('typeId');

  const { createFolderMutation } = useFolders();
  const { createRequestMutation } = useRequests();

  const [step, setStep] = useState<FolderFormStep>('selectType');
  const [selectedType, setSelectedType] = useState<FolderType | null>(null);
  const [createdFolder, setCreatedFolder] = useState<Folder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle pre-selected type from query params
  useEffect(() => {
    if (preSelectedTypeId && folderTypes && folderTypes.length > 0) {
      const foundType = folderTypes.find(type => type.id === preSelectedTypeId);
      if (foundType) {
        setSelectedType(foundType);
        setStep('fillForm');
      }
    }
  }, [preSelectedTypeId, folderTypes]);

  const handleTypeSelect = (folderType: FolderType) => {
    setSelectedType(folderType);
    setStep('fillForm');
  };

  const handleGoBack = () => {
    if (step === 'fillForm' && !preSelectedTypeId) {
      setStep('selectType');
      setSelectedType(null);
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
      setStep('sendRequests');
      toast.success('Dossier créé avec succès !');
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

  const canGoBack = step === 'fillForm' && !preSelectedTypeId;

  return {
    // State
    step,
    selectedType,
    createdFolder,
    isSubmitting,
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
