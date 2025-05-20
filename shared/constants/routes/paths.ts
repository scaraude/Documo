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

} as const;

// Type utilities for routes
export type AppRoutes = typeof ROUTES;
export type RouteKeys = keyof typeof ROUTES;