import { CreateRequestParams } from '../index';
import { DocumentType } from '@/shared/constants';

describe('Request Types', () => {
  test('CreateRequestParams interface is correctly defined', () => {
    // This is more of a TypeScript compilation test than a runtime test
    const params: CreateRequestParams = {
      civilId: '123456',
      requestedDocuments: ['IDENTITY_CARD' as DocumentType],
      expirationDays: 7
    };

    expect(params.civilId).toBe('123456');
    expect(params.requestedDocuments).toEqual(['IDENTITY_CARD']);
    expect(params.expirationDays).toBe(7);

    // Test optional property
    const paramsWithoutExpiration: CreateRequestParams = {
      civilId: '123456',
      requestedDocuments: ['IDENTITY_CARD' as DocumentType]
    };

    expect(paramsWithoutExpiration.expirationDays).toBeUndefined();
  });
});
