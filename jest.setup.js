// Add jest-dom's custom assertions
import '@testing-library/jest-dom';

// Mock the localStorage functionality for tests
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});
