import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormCreateRequest } from '../FormCreateRequest';
import { useRequest } from '../../hooks/useRequest';
import { useRequestTemplates } from '@/features/request-templates';
import { sendNotification } from '@/features/notifications/api/notificationsApi';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/shared/constants';
import { DocumentType } from '@/shared/constants';

// Mock the hooks and component dependencies
jest.mock('../../hooks/useRequest');
jest.mock('@/features/request-templates');
jest.mock('@/features/notifications/api/notificationsApi');
jest.mock('next/navigation');
jest.mock('../SelectTemplate', () => ({
  SelectTemplate: jest.fn(({ selectedTemplateId, setSelectedTemplateId, templates }) => (
    <select
      data-testid="mock-select-template"
      value={selectedTemplateId || ''}
      onChange={(e) => setSelectedTemplateId(e.target.value)}
    >
      <option value="">Select template</option>
      {templates.map((template: { id: string; title: string }) => (
        <option key={template.id} value={template.id}>{template.title}</option>
      ))}
    </select>
  ))
}));

// Mock the IDInput component
jest.mock('@/shared/components/', () => ({
  ButtonCreateModel: () => <button>Create Model</button>,
  IDInput: ({ id, setId }: { id: string; setId: (id: string) => void }) => (
    <input
      data-testid="id-input"
      value={id}
      onChange={(e) => setId(e.target.value)}
    />
  )
}));

describe('FormCreateRequest Component', () => {
  const mockRouter = {
    push: jest.fn()
  };

  const mockCreateRequest = jest.fn();
  const mockTemplates = [
    {
      id: 'template1',
      title: 'Template 1',
      requestedDocuments: ['IDENTITY_CARD' as DocumentType],
      createdAt: '2023-01-01'
    },
    {
      id: 'template2',
      title: 'Template 2',
      requestedDocuments: ['PASSPORT' as DocumentType, 'UTILITY_BILL' as DocumentType],
      createdAt: '2023-01-02'
    }
  ];

  const mockNewRequest = {
    id: 'request1',
    civilId: '123456',
    requestedDocuments: ['IDENTITY_CARD' as DocumentType],
    status: 'pending',
    createdAt: new Date(),
    expiresAt: new Date(),
    lastUpdatedAt: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useRequest as jest.Mock).mockReturnValue({
      createRequest: mockCreateRequest
    });
    (useRequestTemplates as jest.Mock).mockReturnValue({
      templates: mockTemplates,
      hasTemplates: true
    });
    mockCreateRequest.mockResolvedValue(mockNewRequest);
    (sendNotification as jest.Mock).mockResolvedValue(undefined);

    // Mock window.open
    window.open = jest.fn();
  });

  test('renders form with template selection', () => {
    render(<FormCreateRequest />);

    expect(screen.getByText('Nouvelle Demande')).toBeInTheDocument();
    expect(screen.getByText('Sélectionnez un modèle')).toBeInTheDocument();
    expect(screen.getByTestId('mock-select-template')).toBeInTheDocument();

    // ID input shouldn't be shown yet (no template selected)
    expect(screen.queryByTestId('id-input')).not.toBeInTheDocument();
  });

  test('should show ID input when template is selected', () => {
    render(<FormCreateRequest />);

    // Select a template
    fireEvent.change(screen.getByTestId('mock-select-template'), {
      target: { value: 'template1' }
    });

    // ID input should now be shown
    expect(screen.getByTestId('id-input')).toBeInTheDocument();

    // Simulation checkbox should also be shown
    expect(screen.getByText('Simuler la notification sur un autre appareil')).toBeInTheDocument();
  });

  test('should submit form and create request', async () => {
    render(<FormCreateRequest />);

    // Select a template
    fireEvent.change(screen.getByTestId('mock-select-template'), {
      target: { value: 'template1' }
    });

    // Enter ID
    fireEvent.change(screen.getByTestId('id-input'), {
      target: { value: '123456' }
    });

    // Submit form
    fireEvent.click(screen.getByText('Soumettre'));

    await waitFor(() => {
      expect(mockCreateRequest).toHaveBeenCalledWith(
        '123456',
        ['IDENTITY_CARD']
      );
    });

    // Verify notification was sent
    expect(sendNotification).toHaveBeenCalledWith(mockNewRequest);

    // Verify simulation window was opened
    expect(window.open).toHaveBeenCalledWith('/notification', '_blank');

    // Verify redirect to home
    expect(mockRouter.push).toHaveBeenCalledWith(ROUTES.HOME);
  });

  test('should not submit when no template is selected', () => {
    render(<FormCreateRequest />);

    // No template selected, submit button should be disabled
    const submitButton = screen.getByText('Soumettre');
    expect(submitButton).toBeDisabled();

    fireEvent.click(submitButton);

    expect(mockCreateRequest).not.toHaveBeenCalled();
  });

  test('should not submit when no ID is entered', () => {
    render(<FormCreateRequest />);

    // Select a template
    fireEvent.change(screen.getByTestId('mock-select-template'), {
      target: { value: 'template1' }
    });

    // No ID entered, submit button should be disabled
    const submitButton = screen.getByText('Soumettre');
    expect(submitButton).toBeDisabled();

    fireEvent.click(submitButton);

    expect(mockCreateRequest).not.toHaveBeenCalled();
  });

  test('should not simulate notification when simulation checkbox is unchecked', async () => {
    render(<FormCreateRequest />);

    // Select a template
    fireEvent.change(screen.getByTestId('mock-select-template'), {
      target: { value: 'template1' }
    });

    // Enter ID
    fireEvent.change(screen.getByTestId('id-input'), {
      target: { value: '123456' }
    });

    // Uncheck simulation
    fireEvent.click(screen.getByLabelText('Simuler la notification sur un autre appareil'));

    // Submit form
    fireEvent.click(screen.getByText('Soumettre'));

    await waitFor(() => {
      expect(mockCreateRequest).toHaveBeenCalled();
    });

    // Verify notification was not sent
    expect(sendNotification).not.toHaveBeenCalled();
    expect(window.open).not.toHaveBeenCalled();
  });

  test('should render create model button when no templates exist', () => {
    (useRequestTemplates as jest.Mock).mockReturnValue({
      templates: [],
      hasTemplates: false
    });

    render(<FormCreateRequest />);

    expect(screen.getByText('Create Model')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-select-template')).not.toBeInTheDocument();
  });
});
