export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    VERIFY_EMAIL: '/verify-email',
  },
  FOLDER_TYPES: {
    HOME: '/folder-types',
    NEW: '/folder-types/new',
    DETAIL: (id: string) => `/folder-types/${id}`,
    EDIT: (id: string) => `/folder-types/${id}/edit`,
  },
  FOLDERS: {
    HOME: '/folders',
    NEW: '/folders/new',
    NEW_WITH_TYPE: (typeId: string) => `/folders/new?typeId=${typeId}`,
    NEW_WITH_FOLDER: (folderId: string) => `/folders/new?folderId=${folderId}`,
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
  },
} as const;

// Type utilities for routes
type AppRoutes = typeof ROUTES;
type RouteKeys = keyof typeof ROUTES;
