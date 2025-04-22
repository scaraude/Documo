export const ROUTES = {
    HOME: '/',
    REQUESTS: {
        HOME: '/requetes',
        NEW: '/nouvelle-requete',
        // DETAIL: (id: string) => `/requests/${id}`,
    },
    DOCUMENTS: {
        HOME: '/documents',
    },

} as const;

// Type utilities for routes
export type AppRoutes = typeof ROUTES;
export type RouteKeys = keyof typeof ROUTES;