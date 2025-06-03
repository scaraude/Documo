export const API_ROUTES = {
    REQUESTS: {
        BASE: '/api/requests',
        GET_ALL: '/api/requests',
        GET_BY_ID: (id: string) => `/api/requests/${id}`,
        CREATE: '/api/requests',
        UPDATE_STATUS: (id: string) => `/api/requests/${id}/status`,
        DELETE: (id: string) => `/api/requests/${id}`
    },
    TEMPLATES: {
        BASE: '/api/templates',
        GET_ALL: '/api/templates',
        GET_BY_ID: (id: string) => `/api/templates/${id}`,
        CREATE: '/api/templates',
        UPDATE: (id: string) => `/api/templates/${id}`,
        DELETE: (id: string) => `/api/templates/${id}`
    },
    DOCUMENTS: {
        BASE: '/api/documents',
        GET_ALL: '/api/documents',
        GET_BY_ID: (id: string) => `/api/documents/${id}`,
        GET_BY_REQUEST: (requestId: string) => `/api/documents/request/${requestId}`,
        UPLOAD: '/api/documents/upload',
        UPDATE_STATUS: (id: string) => `/api/documents/${id}/status`,
        DELETE: (id: string) => `/api/documents/${id}`
    },
    NOTIFICATIONS: {
        SEND: '/api/notifications/send',
        GET_PENDING: '/api/notifications/pending',
        CLEAR_PENDING: '/api/notifications/pending/clear',
        SAVE_RESPONSE: '/api/notifications/response',
        CHECK_RESPONSE: '/api/notifications/response'
    },
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