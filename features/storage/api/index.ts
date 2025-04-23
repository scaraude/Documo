/**
 * Get an item from localStorage
 * @param key Storage key
 * @returns Parsed value or null if not found
 */
export function getItem<T>(key: string): T | null {
    if (typeof window === 'undefined') {
        return null; // Handle server-side rendering
    }

    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error getting item from storage: ${key}`, error);
        return null;
    }
}

/**
 * Set an item in localStorage
 * @param key Storage key
 * @param value Value to store
 */
export function setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') {
        return; // Handle server-side rendering
    }

    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error setting item in storage: ${key}`, error);
    }
}

/**
 * Remove an item from localStorage
 * @param key Storage key
 */
export function removeItem(key: string): void {
    if (typeof window === 'undefined') {
        return; // Handle server-side rendering
    }

    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing item from storage: ${key}`, error);
    }
}

/**
 * Check if an item exists in localStorage
 * @param key Storage key
 * @returns Boolean indicating if the item exists
 */
export function hasItem(key: string): boolean {
    if (typeof window === 'undefined') {
        return false; // Handle server-side rendering
    }

    return localStorage.getItem(key) !== null;
}