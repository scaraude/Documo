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
        REQUEST: (token: string) => `/external/requests/${token}`,
        UPLOAD: (token: string) => `/external/upload/${token}`,
        UPLOAD_SUCCESS: (token: string) => `/external/upload/${token}/success`,
    }
} as const;

// Type utilities for routes
export type AppRoutes = typeof ROUTES;
export type RouteKeys = keyof typeof ROUTES;