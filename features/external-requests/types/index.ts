import { AppDocument } from '../../../shared/types';

export type AppDocumentToUpload = Omit<
  AppDocument,
  'requestId' | 'dek' | 'url'
>;
