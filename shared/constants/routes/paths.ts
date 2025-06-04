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
        DETAIL: (id: string) => `/requests/${id}`,
    },
    EXTERNAL: {
        REQUEST: (id: string) => `/external/requests/${id}`,
        UPLOAD: (requestId: string) => `/external/upload/${requestId}`,
        UPLOAD_SUCCESS: (requestId: string) => `/external/upload/${requestId}/success`,
    }
} as const;

// Type utilities for routes
export type AppRoutes = typeof ROUTES;
export type RouteKeys = keyof typeof ROUTES;