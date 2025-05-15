import { renderHook, act, waitFor } from '@testing-library/react';
import { useRequestTemplates } from '../useRequestTemplates';
import * as templatesApi from '../../api/requestTemplatesApi';
import { DOCUMENT_TYPES } from '@/shared/constants';
import { RequestTemplate } from '../../types';

// Mock the API module
jest.mock('../../api/requestTemplatesApi');

const mockTemplatesApi = templatesApi as jest.Mocked<typeof templatesApi>;

describe('useRequestTemplates Hook', () => {
    const mockTemplates: RequestTemplate[] = [
        {
            id: '1',
            title: 'Identity Documents',
            requestedDocuments: [DOCUMENT_TYPES.IDENTITY_CARD],
            createdAt: new Date('2023-01-01')
        },
        {
            id: '2',
            title: 'Financial Documents',
            requestedDocuments: [DOCUMENT_TYPES.BANK_STATEMENT, DOCUMENT_TYPES.IDENTITY_CARD],
            createdAt: new Date('2023-01-02')
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        mockTemplatesApi.getTemplates.mockResolvedValue(mockTemplates);
    });

    test('should load templates on mount', async () => {
        const { result } = renderHook(() => useRequestTemplates());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.isLoaded).toBe(false);

        await waitFor(() => {
            expect(result.current.isLoaded).toBe(true);
        });

        expect(result.current.templates).toEqual(mockTemplates);
        expect(result.current.isLoading).toBe(false);
        expect(mockTemplatesApi.getTemplates).toHaveBeenCalledTimes(1);
    });

    test('should handle error when loading templates', async () => {
        const error = new Error('Failed to fetch templates');
        mockTemplatesApi.getTemplates.mockRejectedValue(error);

        const { result } = renderHook(() => useRequestTemplates());

        await waitFor(() => {
            expect(result.current.error).toEqual(error);
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.isLoaded).toBe(false);
    });

    test('should add template successfully', async () => {
        const newTemplate: RequestTemplate = {
            id: '3',
            title: 'New Template',
            requestedDocuments: [DOCUMENT_TYPES.PASSPORT],
            createdAt: new Date()
        };

        mockTemplatesApi.createTemplate.mockResolvedValue(newTemplate);
        mockTemplatesApi.getTemplates.mockResolvedValue(mockTemplates);

        const { result } = renderHook(() => useRequestTemplates());

        await waitFor(() => {
            expect(result.current.isLoaded).toBe(true);
        });

        await act(async () => {
            await result.current.addTemplate('New Template', [DOCUMENT_TYPES.PASSPORT]);
        });

        expect(mockTemplatesApi.createTemplate).toHaveBeenCalledWith({
            title: 'New Template',
            requestedDocuments: [DOCUMENT_TYPES.PASSPORT]
        });

        expect(result.current.templates).toEqual([...mockTemplates, newTemplate]);
    });

    test('should delete template successfully', async () => {
        mockTemplatesApi.getTemplates.mockResolvedValue(mockTemplates);

        const { result } = renderHook(() => useRequestTemplates());

        await waitFor(() => {
            expect(result.current.isLoaded).toBe(true);
        });

        await act(async () => {
            await result.current.deleteTemplate('1');
        });

        expect(mockTemplatesApi.deleteTemplate).toHaveBeenCalledWith('1');
        expect(result.current.templates).toEqual([mockTemplates[1]]);
    });

    test('should update template successfully', async () => {
        const updatedTemplate = {
            ...mockTemplates[0],
            title: 'Updated Template',
            requestedDocuments: [DOCUMENT_TYPES.PASSPORT]
        };

        mockTemplatesApi.updateTemplate.mockResolvedValue(updatedTemplate);
        mockTemplatesApi.getTemplates.mockResolvedValue(mockTemplates);

        const { result } = renderHook(() => useRequestTemplates());

        await waitFor(() => {
            expect(result.current.isLoaded).toBe(true);
        });

        await act(async () => {
            await result.current.updateTemplate(
                '1',
                'Updated Template',
                [DOCUMENT_TYPES.PASSPORT]
            );
        });

        expect(mockTemplatesApi.updateTemplate).toHaveBeenCalledWith('1', {
            title: 'Updated Template',
            requestedDocuments: [DOCUMENT_TYPES.PASSPORT]
        });

        const expectedTemplates = [updatedTemplate, mockTemplates[1]];
        expect(result.current.templates).toEqual(expectedTemplates);
    });
});
