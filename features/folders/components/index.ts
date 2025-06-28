export { FolderForm } from './FolderForm';
export { StepIndicator } from './StepIndicator';
export { TypeSelectionStep } from './TypeSelectionStep';
export { FolderDetailsStep } from './FolderDetailsStep';
export { RequestsStep } from './RequestsStep';
export { LoadingState, EmptyFolderTypesState } from './FolderFormStates';

export type { FolderFormStep } from './StepIndicator';

// Re-export utility functions for convenience
export {
  hasPreselectedFolder,
  hasPreselectedFolderType,
  getPreselectedFolderId,
  getPreselectedFolderTypeId,
} from '../utils/folderFormUtils';
