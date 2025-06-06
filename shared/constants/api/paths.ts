export const API_ROUTES = {
    FOLDER_TYPES: {
        BASE: '/api/folder-types',
        GET_ALL: '/api/folder-types',
        GET_BY_ID: (id: string) => `/api/folder-types/${id}`,
        CREATE: '/api/folder-types',
        UPDATE: (id: string) => `/api/folder-types/${id}`,
        DELETE: (id: string) => `/api/folder-types/${id}`,
        CHECK_USAGE: (id: string) => `/api/folder-types/${id}/check-usage`
    },
    FOLDERS: {
        BASE: '/api/folders',
        GET_ALL: '/api/folders',
        GET_BY_ID: (id: string) => `/api/folders/${id}`,
        CREATE: '/api/folders',
        UPDATE: (id: string) => `/api/folders/${id}`,
        DELETE: (id: string) => `/api/folders/${id}`,
        GET_REQUESTS: (folderId: string) => `/api/folders/${folderId}/requests`,
        ADD_REQUEST: (folderId: string) => `/api/folders/${folderId}/requests`,
        REMOVE_REQUEST: (folderId: string, requestId: string) =>
            `/api/folders/${folderId}/requests/${requestId}`
    },
    EXTERNAL: {
        REQUEST: (id: string) => `/api/external/requests/${id}`,
        UPLOAD: '/api/external/upload',
        SHARE_LINK: (id: string) => `/api/external/share-link/${id}`,
    },
} as const;

// Type utilities for API routes
export type ApiRoutes = typeof API_ROUTES;
export type ApiRouteKeys = keyof typeof API_ROUTES;