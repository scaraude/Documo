'use client';
import { useFolderTypes } from '@/features/folder-types';
import { useFolderForm } from '../hooks/useFolderForm';
import { FolderDetailsStep } from './FolderDetailsStep';
import { EmptyFolderTypesState, LoadingState } from './FolderFormStates';
import { RequestsStep } from './RequestsStep';
import { StepIndicator } from './StepIndicator';
import { TypeSelectionStep } from './TypeSelectionStep';

interface FolderFormProps {
  isLoading: boolean;
}

export const FolderForm = ({ isLoading }: FolderFormProps) => {
  const { getAllFolderTypes } = useFolderTypes();
  const { data: folderTypes, isLoading: isFolderTypesLoading } =
    getAllFolderTypes();
  const {
    step,
    selectedType,
    createdFolder,
    isSubmitting,
    isLoading: isFormLoading,
    canGoBack,
    handleTypeSelect,
    handleGoBack,
    handleFolderSubmit,
    handleSendRequests,
    handleSkipRequests,
    handleCancel,
  } = useFolderForm({ folderTypes });

  // Loading state
  if (isLoading || isFolderTypesLoading || isFormLoading) {
    return <LoadingState />;
  }

  // Empty state
  if (!folderTypes || folderTypes.length === 0) {
    return <EmptyFolderTypesState />;
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <StepIndicator
        currentStep={step}
        canGoBack={canGoBack}
        onGoBack={handleGoBack}
      />

      {/* Step 1: Select Type */}
      {step === 'selectType' && (
        <TypeSelectionStep
          folderTypes={folderTypes}
          onTypeSelect={handleTypeSelect}
        />
      )}

      {/* Step 2: Fill Form */}
      {step === 'fillForm' && selectedType && (
        <FolderDetailsStep
          selectedType={selectedType}
          isLoading={isSubmitting}
          onSubmit={handleFolderSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Step 3: Send Requests */}
      {step === 'sendRequests' && createdFolder && selectedType && (
        <RequestsStep
          folder={createdFolder}
          selectedType={selectedType}
          isLoading={isSubmitting}
          onSendRequests={handleSendRequests}
          onSkip={handleSkipRequests}
        />
      )}
    </div>
  );
};
