export const ROUTES = {
    HOME: '/',
    FOLDER_TYPES: {
        HOME: '/folder-types',
        NEW: '/folder-types/new',
        DETAIL: (id: string) => `/folder-types/${id}`,
        EDIT: (id: string) => `/folder-types/${id}/edit`,
    },
    FOLDERS: {
        HOME: '/folders',
        NEW: '/folders/new',
        DETAIL: (id: string) => `/folders/${id}`,
        EDIT: (id: string) => `/folders/${id}/edit`,
    },
    REQUESTS: {
        HOME: '/requests',
        NEW: '/requests/new',
        DETAIL: (id: string) => `/requests/${id}`,
        TEMPLATES: '/templates',
    },
    DOCUMENTS: {
        HOME: '/documents',
        UPLOAD: '/documents/upload/',
        DETAIL: (id: string) => `/documents/${id}`,
    },
    NOTIFICATIONS: {
        HOME: '/notifications',
    },
    API: {
        REQUESTS: '/api/requests',
        DOCUMENTS: '/api/documents',
        NOTIFICATIONS: '/api/notifications',
        UPLOAD: '/api/documents/upload',
        UPLOAD_STATUS: '/api/documents/upload/status',
    }
} as const;

// Type utilities for routes
export type AppRoutes = typeof ROUTES;
export type RouteKeys = keyof typeof ROUTES;