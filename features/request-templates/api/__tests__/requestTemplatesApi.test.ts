import * as templatesApi from '../requestTemplatesApi';
import * as storage from '@/features/storage/api';
import { DOCUMENT_TYPES } from '@/shared/constants';
import { RequestTemplate } from '../../types';

// Mock the storage module
jest.mock('@/features/storage/api', () => ({
  getItem: jest.fn(),
  setItem: jest.fn()
}));

const mockStorage = storage as jest.Mocked<typeof storage>;

describe('Request Templates API', () => {
  const mockDate = new Date('2023-01-01T00:00:00Z');

  beforeAll(() => {
    // Mock Date.now() and new Date()
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTemplates', () => {
    test('returns templates from storage', async () => {
      const mockTemplates: RequestTemplate[] = [{
        id: '1',
        title: 'Test Template',
        requestedDocuments: [DOCUMENT_TYPES.IDENTITY_CARD],
        createdAt: new Date('2023-01-01')
      }];

      mockStorage.getItem.mockReturnValue(mockTemplates);

      const result = await templatesApi.getTemplates();
      expect(result).toEqual(mockTemplates);
      expect(mockStorage.getItem).toHaveBeenCalledWith('document-request-templates');
    });

    test('returns empty array when no templates exist', async () => {
      mockStorage.getItem.mockReturnValue(null);

      const result = await templatesApi.getTemplates();
      expect(result).toEqual([]);
    });

    test('handles storage errors', async () => {
      mockStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      await expect(templatesApi.getTemplates()).rejects.toThrow('Failed to fetch templates');
    });
  });

  describe('createTemplate', () => {
    test('creates new template and saves to storage', async () => {
      mockStorage.getItem.mockReturnValue([]);

      const newTemplate = await templatesApi.createTemplate({
        title: 'New Template',
        requestedDocuments: [DOCUMENT_TYPES.PASSPORT]
      });

      expect(newTemplate).toEqual({
        id: expect.any(String),
        title: 'New Template',
        requestedDocuments: [DOCUMENT_TYPES.PASSPORT],
        createdAt: mockDate
      });

      expect(mockStorage.setItem).toHaveBeenCalledWith(
        'document-request-templates',
        [newTemplate]
      );
    });
  });

  describe('updateTemplate', () => {
    test('updates existing template', async () => {
      const existingTemplate: RequestTemplate = {
        id: '1',
        title: 'Old Title',
        requestedDocuments: [DOCUMENT_TYPES.IDENTITY_CARD],
        createdAt: new Date('2023-01-01')
      };

      mockStorage.getItem.mockReturnValue([existingTemplate]);

      const updatedTemplate = await templatesApi.updateTemplate('1', {
        title: 'New Title',
        requestedDocuments: [DOCUMENT_TYPES.PASSPORT]
      });

      expect(updatedTemplate).toEqual({
        ...existingTemplate,
        title: 'New Title',
        requestedDocuments: [DOCUMENT_TYPES.PASSPORT]
      });
    });

    test('throws error when template not found', async () => {
      mockStorage.getItem.mockReturnValue([]);

      await expect(templatesApi.updateTemplate('1', { title: 'New Title' }))
        .rejects.toThrow('Failed to update template');
    });
  });

  describe('deleteTemplate', () => {
    test('deletes template from storage', async () => {
      const templates = [
        {
          id: '1',
          title: 'Template 1',
          requestedDocuments: [DOCUMENT_TYPES.IDENTITY_CARD],
          createdAt: new Date('2023-01-01')
        },
        {
          id: '2',
          title: 'Template 2',
          requestedDocuments: [DOCUMENT_TYPES.PASSPORT],
          createdAt: new Date('2023-01-01')
        }
      ];

      mockStorage.getItem.mockReturnValue(templates);

      await templatesApi.deleteTemplate('1');

      expect(mockStorage.setItem).toHaveBeenCalledWith(
        'document-request-templates',
        [templates[1]]
      );
    });
  });

  describe('getTemplateById', () => {
    test('returns template by id', async () => {
      const template = {
        id: '1',
        title: 'Template 1',
        requestedDocuments: [DOCUMENT_TYPES.IDENTITY_CARD],
        createdAt: new Date('2023-01-01')
      };

      mockStorage.getItem.mockReturnValue([template]);

      const result = await templatesApi.getTemplateById('1');
      expect(result).toEqual(template);
    });

    test('returns undefined for non-existent template', async () => {
      mockStorage.getItem.mockReturnValue([]);

      const result = await templatesApi.getTemplateById('1');
      expect(result).toBeUndefined();
    });
  });
});
