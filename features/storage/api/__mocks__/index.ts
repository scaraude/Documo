// Mock implementation of the storage API
const mockStorage: Record<string, string> = {};

export function getItem<T>(key: string): T | null {
  const item = mockStorage[key];
  return item ? JSON.parse(item) : null;
}

export function setItem<T>(key: string, value: T): void {
  mockStorage[key] = JSON.stringify(value);
}

export function removeItem(key: string): void {
  delete mockStorage[key];
}

export function clear(): void {
  Object.keys(mockStorage).forEach(key => {
    delete mockStorage[key];
  });
}
