import type { AppDocument, DocumentRequest } from '@/shared/types';
import { describe, expect, it } from 'vitest';
import { computeRequestStatus } from '../computedStatus';

const createBaseRequest = (): DocumentRequest => ({
  id: 'request-id',
  email: 'test@example.com',
  requestedDocumentIds: ['ID_CARD'],
  createdAt: new Date('2026-01-01T10:00:00Z'),
  expiresAt: new Date('2026-01-08T10:00:00Z'),
  updatedAt: new Date('2026-01-01T10:00:00Z'),
});

const createDocument = (typeId: string): AppDocument => ({
  id: `document-${typeId}`,
  requestId: 'request-id',
  typeId,
  fileName: `${typeId}.pdf`,
  mimeType: 'application/pdf',
  originalSize: 1024,
  url: 'https://example.com/document.pdf',
  hash: 'hash',
  createdAt: new Date('2026-01-01T10:00:00Z'),
  updatedAt: new Date('2026-01-01T10:00:00Z'),
  uploadedAt: new Date('2026-01-01T10:00:00Z'),
  validationErrors: [],
  dek: 'dek',
});

describe('computeRequestStatus', () => {
  it('returns PENDING when request is not accepted', () => {
    const request = createBaseRequest();

    expect(computeRequestStatus(request)).toBe('PENDING');
  });

  it('returns ACCEPTED when request is accepted but has no uploaded document', () => {
    const request = {
      ...createBaseRequest(),
      acceptedAt: new Date('2026-01-01T11:00:00Z'),
    };

    expect(computeRequestStatus(request)).toBe('ACCEPTED');
  });

  it('returns IN_PROGRESS when first upload exists but request is not completed', () => {
    const request = {
      ...createBaseRequest(),
      acceptedAt: new Date('2026-01-01T11:00:00Z'),
      firstDocumentUploadedAt: new Date('2026-01-01T12:00:00Z'),
    };

    expect(computeRequestStatus(request)).toBe('IN_PROGRESS');
  });

  it('returns COMPLETED when request.completedAt is set', () => {
    const request = {
      ...createBaseRequest(),
      acceptedAt: new Date('2026-01-01T11:00:00Z'),
      completedAt: new Date('2026-01-01T13:00:00Z'),
    };

    expect(computeRequestStatus(request)).toBe('COMPLETED');
  });

  it('returns COMPLETED when all requested document types are uploaded', () => {
    const request = {
      ...createBaseRequest(),
      acceptedAt: new Date('2026-01-01T11:00:00Z'),
      requestedDocumentIds: ['ID_CARD', 'PROOF_OF_ADDRESS'],
      documents: [createDocument('ID_CARD'), createDocument('PROOF_OF_ADDRESS')],
    };

    expect(computeRequestStatus(request)).toBe('COMPLETED');
  });

  it('returns REJECTED when request is rejected', () => {
    const request = {
      ...createBaseRequest(),
      rejectedAt: new Date('2026-01-01T11:00:00Z'),
      acceptedAt: new Date('2026-01-01T10:30:00Z'),
    };

    expect(computeRequestStatus(request)).toBe('REJECTED');
  });
});
