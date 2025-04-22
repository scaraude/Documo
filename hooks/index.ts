// Barrel file for hooks
export { useDocumentRequest } from './useDocumentRequest';
export { useDocumentRequestTemplates } from './useDocumentRequestTemplates';
export { useNotifications } from './useNotifications';

// Re-export types
export type { DocumentRequest } from '@/lib/api/types';
export type { AvailableDocument } from './types';

// Export constants
export { AVAILABLE_DOCUMENTS } from './types';