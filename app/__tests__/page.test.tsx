import { render, screen } from '@testing-library/react';
import Home from '../page';

// Mock the imported components
jest.mock('@/features/requests/components', () => ({
  RequestsList: jest.fn(() => <div data-testid="requests-list-mock" />),
}));

jest.mock('@/shared/components', () => ({
  ActionSection: jest.fn(() => <div data-testid="action-section-mock" />),
  HeroSection: jest.fn(() => <div data-testid="hero-section-mock" />),
}));

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all required components', () => {
    render(<Home />);

    expect(screen.getByTestId('hero-section-mock')).toBeInTheDocument();
    expect(screen.getByTestId('action-section-mock')).toBeInTheDocument();
    expect(screen.getByTestId('requests-list-mock')).toBeInTheDocument();
  });

  test('applies correct wrapper styles', () => {
    const { container } = render(<Home />);

    // Check for main container with appropriate classes
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('bg-gradient-to-r');
    expect(mainContainer).toHaveClass('from-blue-50');
    expect(mainContainer).toHaveClass('to-indigo-50');

    // Check the inner flex container for flex styling
    const flexContainer = container.firstChild?.firstChild;
    expect(flexContainer).toHaveClass('min-h-screen');
    expect(flexContainer).toHaveClass('flex');
    expect(flexContainer).toHaveClass('flex-col');
  });
});
