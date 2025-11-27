import { ROUTES } from '@/shared/constants/routes/paths';
import type { FolderFormStep } from '../components/StepIndicator';

/**
 * Utility functions for folder form navigation and URL generation
 */

/**
 * Determine the current step based on URL parameters
 * @param searchParams - URL search parameters
 * @returns The current step of the folder form
 */
export const getCurrentStepFromUrl = (
  searchParams: URLSearchParams,
): FolderFormStep => {
  // Priority 1: folderId means we're at sendRequests step
  if (searchParams.has('folderId')) {
    return 'sendRequests';
  }

  // Priority 2: typeId means we're at fillForm step
  if (searchParams.has('typeId')) {
    return 'fillForm';
  }

  // Priority 3: explicit step parameter
  const explicitStep = searchParams.get('step') as FolderFormStep;
  if (
    explicitStep &&
    ['selectType', 'fillForm', 'sendRequests'].includes(explicitStep)
  ) {
    return explicitStep;
  }

  // Default: start at selectType
  return 'selectType';
};

/**
 * Check if current URL has a preselected folder
 * @param searchParams - URL search parameters
 * @returns True if a folder is preselected
 */
export const hasPreselectedFolder = (
  searchParams: URLSearchParams,
): boolean => {
  return searchParams.has('folderId');
};

/**
 * Check if current URL has a preselected folder type
 * @param searchParams - URL search parameters
 * @returns True if a folder type is preselected
 */
export const hasPreselectedFolderType = (
  searchParams: URLSearchParams,
): boolean => {
  return searchParams.has('typeId');
};

/**
 * Get preselected folder ID from URL
 * @param searchParams - URL search parameters
 * @returns Folder ID if present, null otherwise
 */
export const getPreselectedFolderId = (
  searchParams: URLSearchParams,
): string | null => {
  return searchParams.get('folderId');
};

/**
 * Get preselected folder type ID from URL
 * @param searchParams - URL search parameters
 * @returns Folder type ID if present, null otherwise
 */
export const getPreselectedFolderTypeId = (
  searchParams: URLSearchParams,
): string | null => {
  return searchParams.get('typeId');
};

/**
 * Generate URL to navigate to fillForm step with selected type
 * @param typeId - The folder type ID to preselect
 * @returns URL for fillForm step with typeId
 */
export const generateFillFormUrl = (typeId: string): string => {
  return ROUTES.FOLDERS.NEW_WITH_TYPE(typeId);
};

/**
 * Generate URL to navigate to sendRequests step with created folder
 * @param folderId - The created folder ID
 * @returns URL for sendRequests step with folderId
 */
export const generateSendRequestsUrl = (folderId: string): string => {
  return ROUTES.FOLDERS.NEW_WITH_FOLDER(folderId);
};

/**
 * Generate URL to navigate back to selectType step
 * @returns URL for selectType step
 */
export const generateSelectTypeUrl = (): string => {
  return ROUTES.FOLDERS.NEW;
};

/**
 * Check if we can navigate back based on current URL
 * @param searchParams - URL search parameters
 * @returns True if back navigation is allowed
 */
export const canNavigateBack = (searchParams: URLSearchParams): boolean => {
  const step = getCurrentStepFromUrl(searchParams);
  return (
    step === 'fillForm' &&
    !searchParams.has('typeId') &&
    !searchParams.has('folderId')
  );
};
