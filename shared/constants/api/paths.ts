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
        CHECK_RESPONSE: '/api/notifications/response/check'
    }
} as const;

// Type utilities for API routes
export type ApiRoutes = typeof API_ROUTES;
export type ApiRouteKeys = keyof typeof API_ROUTES;