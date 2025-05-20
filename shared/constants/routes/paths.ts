export const ROUTES = {
    HOME: '/',
    REQUESTS: {
        HOME: '/templates',
        NEW: '/new-request',
        // DETAIL: (id: string) => `/requests/${id}`,
    },
    DOCUMENTS: {
        HOME: '/documents',
        UPLOAD: '/documents/upload/',
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