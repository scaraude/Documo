import type { AppDocument } from '../../../shared/types';

export type AppDocumentToUpload = Omit<
  AppDocument,
  'requestId' | 'dek' | 'url' | 'type'
> & {
  typeId: string; // DocumentTypeId
};
