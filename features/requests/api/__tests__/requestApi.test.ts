import * as requestApi from '../requestApi';
import * as storage from '@/features/storage/api';
import 'jest-localstorage-mock';
import { DOCUMENT_TYPES, REQUEST_STATUS } from '@/shared/constants';

// Mock the storage module
jest.mock('@/features/storage/api', () => ({
  getItem: jest.fn(),
  setItem: jest.fn()
}));

const mockStorage = storage as jest.Mocked<typeof storage>;

describe('Request API', () => {
  const mockDate = new Date('2023-01-01T00:00:00Z');

  // Mock Date constructor
  const OriginalDate = global.Date;
  beforeAll(() => {
    global.Date = class extends OriginalDate {
      constructor() {
        super();
        return mockDate;
      }
    } as DateConstructor;
  });

  afterAll(() => {
    global.Date = OriginalDate;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRequests', () => {
    test('should return requests from storage with dates converted', async () => {
      const storedRequests = [
        {
          id: '1',
          civilId: '123456',
          requestedDocuments: [DOCUMENT_TYPES.IDENTITY_CARD],
          status: REQUEST_STATUS.PENDING,
          createdAt: '2023-01-01T00:00:00Z',
          expiresAt: '2023-01-08T00:00:00Z',
          lastUpdatedAt: '2023-01-01T00:00:00Z'
        }
      ];

      mockStorage.getItem.mockReturnValue(storedRequests);

      const result = await requestApi.getRequests();

      expect(mockStorage.getItem).toHaveBeenCalledWith('requests');
      expect(result).toEqual([
        {
          id: '1',
          civilId: '123456',
          requestedDocuments: [DOCUMENT_TYPES.IDENTITY_CARD],
          status: REQUEST_STATUS.PENDING,
          createdAt: new Date('2023-01-01T00:00:00Z'),
          expiresAt: new Date('2023-01-08T00:00:00Z'),
          lastUpdatedAt: new Date('2023-01-01T00:00:00Z')
        }
      ]);
    });

    test('should return empty array when no requests exist', async () => {
      mockStorage.getItem.mockReturnValue(null);

      const result = await requestApi.getRequests();

      expect(result).toEqual([]);
    });

    test('should handle errors', async () => {
      mockStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      await expect(requestApi.getRequests()).rejects.toThrow('Failed to fetch requests');
    });
  });

  describe('createRequest', () => {
    test('should create a new request with default expiration', async () => {
      const DEFAULT_EXPIRATION_DAYS = 7;
      const expiryDate = new Date(mockDate.getTime() + DEFAULT_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
      mockStorage.getItem.mockReturnValue([]);
      mockStorage.setItem.mockImplementation(() => { });

      const params = {
        civilId: '123456',
        requestedDocuments: [DOCUMENT_TYPES.IDENTITY_CARD]
      };

      const result = await requestApi.createRequest(params);

      expect(result).toEqual({
        id: result.id,
        civilId: '123456',
        requestedDocuments: [DOCUMENT_TYPES.IDENTITY_CARD],
        status: REQUEST_STATUS.PENDING,
        createdAt: mockDate,
        expiresAt: expiryDate,
        lastUpdatedAt: mockDate
      });

      expect(mockStorage.setItem).toHaveBeenCalledWith('requests', [result]);
    });

    test('should create a new request with custom expiration', async () => {
      mockStorage.getItem.mockReturnValue([]);

      const params = {
        civilId: '123456',
        requestedDocuments: [DOCUMENT_TYPES.IDENTITY_CARD],
        expirationDays: 14
      };

      const customExpiryDate = new Date('2023-01-15T00:00:00Z');

      const result = await requestApi.createRequest(params);

      expect(result.expiresAt).toEqual(customExpiryDate);
    });

    test('should handle errors', async () => {
      mockStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const params = {
        civilId: '123456',
        requestedDocuments: [DOCUMENT_TYPES.IDENTITY_CARD]
      };

      await expect(requestApi.createRequest(params)).rejects.toThrow('Failed to create request');
    });
  });

  describe('updateRequestStatus', () => {
    test('should update request status', async () => {
      const existingRequests = [
        {
          id: '1',
          civilId: '123456',
          requestedDocuments: [DOCUMENT_TYPES.IDENTITY_CARD],
          status: REQUEST_STATUS.PENDING,
          createdAt: new Date('2023-01-01'),
          expiresAt: new Date('2023-01-08'),
          lastUpdatedAt: new Date('2023-01-01')
        }
      ];

      mockStorage.getItem.mockReturnValue(existingRequests);

      const result = await requestApi.updateRequestStatus('1', REQUEST_STATUS.ACCEPTED);

      expect(result).toEqual({
        id: '1',
        civilId: '123456',
        requestedDocuments: [DOCUMENT_TYPES.IDENTITY_CARD],
        status: REQUEST_STATUS.ACCEPTED,
        createdAt: new Date('2023-01-01'),
        expiresAt: new Date('2023-01-08'),
        lastUpdatedAt: mockDate
      });

      expect(mockStorage.setItem).toHaveBeenCalledWith('requests', [result]);
    });

    test('should throw error when request not found', async () => {
      mockStorage.getItem.mockReturnValue([]);

      await expect(requestApi.updateRequestStatus('1', REQUEST_STATUS.ACCEPTED))
        .rejects.toThrow('Failed to update request status');
    });
  });

  describe('deleteRequest', () => {
    test('should delete request by id', async () => {
      const existingRequests = [
        {
          id: '1',
          civilId: '123456',
          requestedDocuments: [DOCUMENT_TYPES.IDENTITY_CARD],
          status: REQUEST_STATUS.PENDING,
          createdAt: new Date('2023-01-01'),
          expiresAt: new Date('2023-01-08'),
          lastUpdatedAt: new Date('2023-01-01')
        },
        {
          id: '2',
          civilId: '789012',
          requestedDocuments: [DOCUMENT_TYPES.PASSPORT],
          status: REQUEST_STATUS.PENDING,
          createdAt: new Date('2023-01-02'),
          expiresAt: new Date('2023-01-09'),
          lastUpdatedAt: new Date('2023-01-02')
        }
      ];

      mockStorage.getItem.mockReturnValue(existingRequests);

      await requestApi.deleteRequest('1');

      expect(mockStorage.setItem).toHaveBeenCalledWith('requests', [existingRequests[1]]);
    });
  });

  describe('getRequestById', () => {
    test('should return request by id', async () => {
      const existingRequests = [
        {
          id: '1',
          civilId: '123456',
          requestedDocuments: [DOCUMENT_TYPES.IDENTITY_CARD],
          status: REQUEST_STATUS.PENDING,
          createdAt: new Date('2023-01-01'),
          expiresAt: new Date('2023-01-08'),
          lastUpdatedAt: new Date('2023-01-01')
        }
      ];

      mockStorage.getItem.mockReturnValue(existingRequests);

      const result = await requestApi.getRequestById('1');

      expect(result).toEqual(existingRequests[0]);
    });

    test('should return undefined when request not found', async () => {
      mockStorage.getItem.mockReturnValue([]);

      const result = await requestApi.getRequestById('1');

      expect(result).toBeUndefined();
    });
  });
});
