import { useState, useEffect, useCallback } from 'react';
import { AppDocument } from '@/shared/types';
import { decryptBlob, importEncryptionKey } from '../utils/encryption';

export interface DecryptedDocumentState {
  objectUrl: string | null;
  isLoading: boolean;
  error: string | null;
  decryptDocument: () => Promise<void>;
}

export function useDecryptedDocument(
  document: AppDocument
): DecryptedDocumentState {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cleanup object URL on unmount or when document changes
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const decryptDocument = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!document.url || !document.dek) {
        throw new Error('Document URL or DEK is missing');
      }

      // Fetch the encrypted file
      const response = await fetch(document.url!);
      const encryptedBlob = await response.blob();

      // Import the DEK (Document Encryption Key)
      const key = await importEncryptionKey(document.dek);

      // Create a new blob with the decrypted data
      const decryptedBlob = await decryptBlob(
        encryptedBlob,
        key,
        document.mimeType
      );
      const url = URL.createObjectURL(decryptedBlob);
      setObjectUrl(url);
    } catch (err) {
      console.error('Failed to decrypt document:', err);
      setError('Failed to decrypt document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [document.url, document.dek, document.mimeType]);

  // Automatically decrypt when document changes
  useEffect(() => {
    if (document.url && !objectUrl && !isLoading && !error) {
      decryptDocument();
    }
  }, [
    document.url,
    document.dek,
    objectUrl,
    isLoading,
    error,
    decryptDocument,
  ]);

  return {
    objectUrl,
    isLoading,
    error,
    decryptDocument,
  };
}
