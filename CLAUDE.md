# CLAUDE.md

# Codebase-Specific Instructions for LLM Development

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Application Information

- **Application Name**: Documo
- **Slogan**: l'échange de document à l'ère moderne
- **Description**: A modern document transfer and exchange platform

## Build & Development Commands

- `yarn dev`: Start dev server with database setup
- `yarn build`: Build for production
- `yarn start`: Start production server
- `yarn lint`: Run Biome linting and formatting checks
- `yarn lint:fix`: Run Biome with auto-fix
- `yarn format`: Format code with Biome
- `yarn format:check`: Check code formatting with Biome
- `yarn test`: Run unit tests with Vitest
- `yarn test:watch`: Run tests in watch mode
- `yarn test:coverage`: Run tests with coverage report
- `yarn test:integration`: Run integration tests with database isolation
- `yarn test:integration:watch`: Run integration tests in watch mode
- `yarn test:db:up`: Start test database with Docker
- `yarn test:db:down`: Stop and remove test database
- `yarn test:seed`: Manually seed test database with test data
- `yarn test:e2e`: Run end-to-end tests with Playwright
- `yarn test:e2e:ui`: Run E2E tests with Playwright UI mode
- `yarn test:e2e:headed`: Run E2E tests with visible browser
- `yarn prisma:generate`: Generate Prisma client
- `yarn prisma:migrate`: Run database migrations
- `yarn prisma:studio`: Open Prisma database UI
- `yarn unused`: Check for unused files, exports, and dependencies with Knip
- `yarn unused:files`: Check for unused files only
- `yarn unused:exports`: Check for unused exports only
- `yarn unused:deps`: Check for unused dependencies only
- `yarn unused:fix`: Auto-fix unused exports
- `yarn clean`: Auto-fix unused exports and run linter
- `yarn ts`: Type-check TypeScript without emitting files
- `yarn ts-watch`: Type-check TypeScript in watch mode

## Code Style Guidelines

- **Formatting**: Use Biome for linting and formatting (80 char width, single quotes, 2 spaces)
- **TypeScript**: Use strict typing with interfaces/types in separate files
- **Import order**: React, external libs, shared, features, local (auto-sorted by Biome)
- **Naming**: PascalCase for components/types, camelCase for variables/functions
- **Components**: Functional components with explicit props interfaces
- **State**: Use hooks (useState, useReducer) with typed state
- **Error handling**: Try/catch with specific error messages
- **Repository pattern**: Data access in repository files, API in api files
- **Testing**: Component tests with Vitest + React Testing Library, repository tests with mocks
- **Documentation**: JSDoc comments for functions and types
- **Logging**: Use structured logging with Pino logger (see Logging section)
- **Environment**: Import validated env from `@/lib/config/env` (see Environment Validation section)

## MORE GUIDELINE

## General Guidelines

- **Expertise**: Assume expertise in web development.
- **Clean Code**: Follow clean code principles.
- **TypeScript Best Practices**: don't use `any` type and adhere to TypeScript best practices.
- **Append-Only Modeling**: Use append-only principles for data modeling.
- **Descriptive Properties**: Avoid using status fields; calculate status dynamically from descriptive properties.

## Technology Stack

- **Frontend**: Use React and Next.js.
- **Styling**: Use Tailwind CSS and Shadcn.
- **Package Manager**: Use Yarn.

## Workspace Context

- **Folder Structure**: Respect the current workspace structure as outlined below:
  - **app/**: Contains Next.js pages and API routes.
  - **features/**: Encapsulates domain-specific logic, including components, hooks, repositories, and types.
  - **shared/**: Houses reusable components, constants, hooks, and schemas.
  - **lib/**: Contains utility functions and Prisma-related files.
  - **prisma/**: Includes the Prisma schema and migrations.
  - **public/**: Stores static assets.

## Coding Practices

- **Component Structure**: Follow the existing folder and component structure.
- **Testing**: Write tests for new features and ensure existing tests pass.
- **Error Handling**: Implement robust error handling.
- **Documentation**: Update relevant documentation for new features.
- **Git Practices**: Commit changes with clear and descriptive messages.
- **Dependencies**: Ensure all dependencies are properly installed and updated.
- **API types**: Ensure all API types are properly defined and used (ex: "/types/api.ts").

## Additional Notes

- **API Routes**: Place new API routes under the `app/api/` folder.
- **Shared Components**: Use shared components from `shared/components/` where applicable.
- **Hooks**: Leverage existing hooks or create new ones under `features/<domain>/hooks/`.
- **Repositories**: Implement data access logic in `features/<domain>/repository/`.
- **Utilities**: Add reusable utility functions to `lib/utils.ts`.
- **Paths**: all routes will be define in a constants in a paths.ts file

## Testing Guidelines

- **Test Framework**: Use Vitest for unit and integration tests, Playwright for E2E tests
- **Unit Tests**: Write unit tests for components, hooks, and repositories with Vitest
- **Integration Tests**: Test API routes and their interactions with the database.
- **Test Location**: Place tests in the `__tests__/` folder within the relevant domain.

## Append-Only Modeling

- **Principle**: Ensure data models are append-only, avoiding destructive updates.
- **Implementation**: Use Prisma migrations to evolve the schema while preserving historical data.

## Status Calculation

- **Avoid Status Fields**: Use descriptive properties to calculate status dynamically.
- **Example**: Use `createdAt` and `updatedAt` timestamps to infer the state of an entity.

## Tailwind CSS and Shadcn

- **Styling**: Use Tailwind CSS for utility-first styling and Shadcn for pre-built components.
- **Consistency**: Follow existing styling conventions in the codebase.

## Git Practices

- **Commit Messages**: Use clear and descriptive commit messages.
- **Branching**: Create feature branches for new development.
- **Pull Requests**: Submit pull requests with detailed descriptions and link to relevant issues.

## Documentation

- **Update**: Ensure documentation is updated for new features.
- **Location**: Place documentation in the `README.md` or relevant markdown files in the `docs/` folder.

## Dependencies

- **Installation**: Use Yarn to install dependencies.
- **Updates**: Regularly update dependencies to their latest stable versions.

## Logging Guidelines

- **Logger**: Use Pino structured logging from `@/lib/logger`
- **Import**: Always import logger with `import logger from '@/lib/logger'`
- **Structure**: Use structured logging with context objects
  ```typescript
  logger.info({ userId, operation: 'user.create' }, 'Creating new user');
  logger.error({ userId, error: error.message }, 'Failed to create user');
  ```
- **Log Levels**: Use appropriate log levels (debug, info, warn, error)
- **Context**: Include relevant context like IDs, operation names, and metadata
- **Security**: Mask sensitive data (tokens, passwords) in logs
  ```typescript
  logger.info({ token: token.substring(0, 8) + '...' }, 'Processing token');
  ```
- **Error Handling**: Always log errors with context before throwing
- **Development**: Run `yarn dev` for pretty-formatted logs in development
- **Production**: Logs output as JSON for structured parsing in production

## Environment Validation Guidelines

- **Zod Validation**: All environment variables are validated at startup using Zod schemas
- **Configuration File**: Import validated env from `@/lib/config/env`
- **Type Safety**: Environment variables are fully typed and validated
- **Error Handling**: Application fails fast with clear error messages for missing/invalid env vars
- **Usage Pattern**:
  ```typescript
  import { env, isDevelopment, getDatabaseUrl } from '@/lib/config/env';

  // Access type-safe, validated environment variables
  const apiKey = env.RESEND_API_KEY;
  const dbUrl = getDatabaseUrl(); // Returns TEST_DATABASE_URL in test mode

  if (isDevelopment) {
    console.log('Running in development mode');
  }
  ```
- **Adding New Variables**:
  1. Add to `.env.example` with placeholder value
  2. Add to Zod schema in `lib/config/env.ts`
  3. Add to `Env` type (auto-inferred from schema)
  4. Update your `.env.local` with actual value
- **Environment Files**:
  - `.env.example`: Template (committed to git)
  - `.env.local`: Your local config (gitignored, create from example)
  - `.env.test`: Test environment config (committed to git)
- **Never** access `process.env` directly - always use the validated `env` object

## Toast Notifications Guidelines

- **Toast System**: Use Sonner toast system (imported as `import { toast } from 'sonner'`)
- **Toast Setup**: Toaster component is already configured in app/layout.tsx with `<Toaster richColors />`
- **Toast Methods**: Use `toast.success()`, `toast.error()`, `toast.info()`, `toast.warning()`
- **Example Usage**:
  ```typescript
  import { toast } from 'sonner';
  
  // Success notification
  toast.success('Dossier créé avec succès');
  
  // Error notification
  toast.error('Une erreur est survenue');
  ```

## tRPC Authentication Error Handling

- **Authentication Errors**: When `protectedProcedure` fails, it throws `UNAUTHORIZED` TRPCError
- **Error Handling Pattern**: Handle authentication errors in tRPC client using error callbacks
- **Redirect Pattern**: On authentication failure, show toast and redirect to login page
- **Implementation**: Use tRPC mutation/query `onError` callbacks to handle auth errors
- **Login Redirect**: Use `router.push(ROUTES.AUTH.LOGIN)` from Next.js navigation

### Usage Examples

#### Method 1: Using the useAuthErrorHandler hook (Recommended)
```typescript
import { useAuthErrorHandler } from '@/shared/utils';

export default function MyComponent() {
  const { createErrorHandler } = useAuthErrorHandler();
  const myMutation = trpc.myRouter.myMutation.useMutation();

  const handleAction = () => {
    myMutation.mutate(data, {
      onError: createErrorHandler(), // Automatically handles auth errors
      onSuccess: (result) => {
        toast.success('Action completed successfully');
      },
    });
  };
}
```

#### Method 2: Manual error handling
```typescript
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ROUTES } from '@/shared/constants';
import { isAuthError } from '@/shared/utils';

export default function MyComponent() {
  const router = useRouter();
  const myMutation = trpc.myRouter.myMutation.useMutation();

  const handleAction = () => {
    myMutation.mutate(data, {
      onError: (error) => {
        if (isAuthError(error)) {
          toast.error('Votre session a expiré. Veuillez vous reconnecter.');
          router.push(ROUTES.AUTH.LOGIN);
          return;
        }
        // Handle other errors
        toast.error('Une erreur est survenue');
      },
    });
  };
}
```

#### Method 3: Custom hook with built-in error handling
```typescript
// In your custom hook
export function useMyFeature() {
  const { createErrorHandler } = useAuthErrorHandler();
  
  const myMutation = trpc.myRouter.myMutation.useMutation({
    onError: createErrorHandler(),
  });

  return { myMutation };
}
```

### Query Error Handling

For queries, authentication errors should be handled at the component level since tRPC queries don't support `onError` in the hook definition:

```typescript
export default function MyComponent() {
  const { handleAuthError } = useAuthErrorHandler();
  
  const { data, error } = trpc.myRouter.myQuery.useQuery();
  
  // Handle errors in useEffect
  useEffect(() => {
    if (error && !handleAuthError(error)) {
      // Handle other types of errors
      toast.error('Failed to load data');
    }
  }, [error, handleAuthError]);
}
```

### Global Error Handling

For comprehensive error handling, you can also set up global error handling in the tRPC client configuration by adding error links to handle authentication errors across all queries and mutations.

## tRPC Cache Invalidation Guidelines

- **Cache Management**: Use `trpc.useUtils()` to access invalidation utilities
- **Mutation Success**: Always invalidate related queries after successful mutations
- **Invalidation Patterns**: Choose between specific query invalidation vs router-wide invalidation
- **Toast Notifications**: Combine cache invalidation with success toast messages

### Cache Invalidation Patterns

#### Method 1: Specific Query Invalidation (Recommended)
```typescript
export function useMyFeature() {
  const { createErrorHandler } = useAuthErrorHandler();
  const utils = trpc.useUtils();

  const createMutation = trpc.myRouter.create.useMutation({
    onError: createErrorHandler(),
    onSuccess: () => {
      // Invalidate specific queries
      utils.myRouter.getAll.invalidate();
      toast.success('Créé avec succès');
    },
  });

  const updateMutation = trpc.myRouter.update.useMutation({
    onError: createErrorHandler(),
    onSuccess: updatedItem => {
      // Invalidate both list and specific item queries
      utils.myRouter.getAll.invalidate();
      utils.myRouter.getById.invalidate({ id: updatedItem.id });
      toast.success('Mis à jour avec succès');
    },
  });

  const deleteMutation = trpc.myRouter.delete.useMutation({
    onError: createErrorHandler(),
    onSuccess: () => {
      // Invalidate list queries
      utils.myRouter.getAll.invalidate();
      toast.success('Supprimé avec succès');
    },
  });
}
```

#### Method 2: Router-wide Invalidation
```typescript
const createMutation = trpc.myRouter.create.useMutation({
  onSuccess: () => {
    // Invalidate all queries in the router
    utils.myRouter.invalidate();
    toast.success('Créé avec succès');
  },
});
```

#### Method 3: Global Cache Invalidation
```typescript
const createMutation = trpc.myRouter.create.useMutation({
  onSuccess: () => {
    // Invalidate ALL queries across all routers (use sparingly)
    utils.invalidate();
    toast.success('Créé avec succès');
  },
});
```

### Best Practices

- **Granular Invalidation**: Prefer specific query invalidation over broad invalidation for better performance
- **Related Data**: Always invalidate queries that display related data (e.g., lists, counts, dependent entities)
- **User Feedback**: Combine invalidation with toast notifications for better UX
- **Optimistic Updates**: Consider optimistic updates for immediate UI feedback before server response

### Real-World Example: Related Data Invalidation

```typescript
export function useFolders() {
  const { createErrorHandler } = useAuthErrorHandler();
  const utils = trpc.useUtils();

  const createFolderMutation = trpc.folder.create.useMutation({
    onError: createErrorHandler(),
    onSuccess: () => {
      // Invalidate folders list since we added a new folder
      utils.folder.getAll.invalidate();
      // Also invalidate folder types if they show count of folders
      utils.folderTypes.getAll.invalidate();
      toast.success('Dossier créé avec succès');
    },
  });

  const removeRequestFromFolderMutation = trpc.folder.removeRequestFromFolder.useMutation({
    onError: createErrorHandler(),
    onSuccess: () => {
      // Multiple invalidations for related data
      utils.folder.getAll.invalidate(); // Update folder list
      utils.requests.getAll.invalidate(); // Update requests list
      utils.folder.getByIdWithRelations.invalidate(); // Update folder details
      toast.success('Demande retirée du dossier avec succès');
    },
  });
}
```

### Common Invalidation Patterns by Operation

- **Create**: Invalidate list queries (`getAll`)
- **Update**: Invalidate both list (`getAll`) and specific item (`getById`) queries
- **Delete**: Invalidate list queries and any dependent counts/statistics
- **Bulk Operations**: Consider invalidating entire router or using `utils.invalidate()`

## Next.js Authorization in Routing Guidelines

- **Route Groups**: Use route groups like `(authenticated)` to organize protected routes
- **Layout-Based Auth**: Implement authentication layouts for route-level protection
- **Client-Side Protection**: Use authentication layouts for UX but always validate server-side
- **Redirect Pattern**: Redirect unauthenticated users to login page
- **Loading States**: Show loading indicators while checking authentication status

### Authorization Implementation

#### Route Group Structure
```
app/
├── (authenticated)/          # Protected routes
│   ├── layout.tsx           # Authentication layout
│   ├── folder-types/        # Protected feature
│   └── folders/             # Protected feature
├── (public)/                # Public routes (optional)
│   ├── about/
│   └── contact/
├── login/                   # Auth pages (outside groups)
├── signup/
└── layout.tsx              # Root layout
```

#### Authentication Layout Pattern
```typescript
'use client';

import { useAuth } from '@/features/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/shared/constants';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(ROUTES.AUTH.LOGIN);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
```

#### Route Protection Best Practices

- **Server-Side Validation**: Always validate authentication server-side with `protectedProcedure`
- **URL Structure**: Route groups don't affect URLs - `/folder-types` works the same
- **Loading UX**: Show loading states while checking authentication
- **Graceful Redirects**: Redirect to login without showing protected content
- **Multiple Auth Levels**: Use different route groups for different permission levels

#### Security Considerations

⚠️ **Important**: Layout-based authentication is for UX only. Always implement:
- Server-side authentication in tRPC procedures
- API route protection
- Database-level authorization
- Proper session management

## Ownership-Based Access Control Guidelines

- **Multi-Layer Security**: Implement defense in depth with authentication, authorization, and ownership checks
- **Repository-Level Security**: Create security-aware repository functions for data access control
- **User Context**: Always pass authenticated user context to enforce ownership rules
- **Logging**: Log all security events (access attempts, ownership violations, etc.)

### Security Architecture Layers

1. **Middleware Layer**: Route-level authentication (Next.js middleware)
2. **Layout Layer**: Client-side authentication UX (`(authenticated)` route groups)
3. **tRPC Layer**: Server-side authentication (`protectedProcedure`)
4. **Repository Layer**: Data access control with ownership validation

### Repository-Level Security Implementation

#### Security-Aware Repository Functions

Create parallel repository functions that enforce ownership:

```typescript
// Standard function (use only for admin or system operations)
export async function getFolderById(id: string): Promise<Folder | null> {
  // Returns any folder by ID
}

// Security-aware function (use for user operations)
export async function getFolderByIdForUser(
  id: string, 
  userId: string
): Promise<Folder | null> {
  const folder = await prisma.folder.findUnique({
    where: { 
      id,
      archivedAt: null,
      createdById: userId  // Ownership check
    },
    include: { requestedDocuments: true },
  });
  return folder ? toAppModel(folder) : null;
}
```

#### Ownership Validation Functions

Create utility functions to check ownership:

```typescript
export async function userOwnsRequestFolder(
  requestId: string,
  userId: string
): Promise<boolean> {
  try {
    const request = await prisma.documentRequest.findUnique({
      where: { id: requestId },
      include: { folder: true },
    });
    
    return request?.folder?.createdById === userId;
  } catch (error) {
    logger.error({ requestId, userId, error }, 'Error checking folder ownership');
    return false; // Fail secure
  }
}
```

### tRPC Router Security Patterns

#### Standard Security Pattern

```typescript
export const folderRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    // Use user-scoped repository function
    return await folderRepository.getFoldersByUserId(ctx.user.id);
  }),
  
  getByIdWithRelations: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      // Check ownership before returning data
      const result = await folderRepository.getFolderByIdWithRelationsForUser(
        input.id,
        ctx.user.id
      );
      
      if (!result) {
        throw new Error('Folder not found or access denied');
      }
      
      return result;
    }),
});
```

#### Ownership Validation in Mutations

```typescript
delete: protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .mutation(async ({ input, ctx }) => {
    // Verify ownership before allowing operation
    const folder = await folderRepository.getFolderByIdForUser(
      input.id, 
      ctx.user.id
    );
    
    if (!folder) {
      logger.warn(
        { folderId: input.id, userId: ctx.user.id },
        'Unauthorized delete attempt'
      );
      throw new Error('Folder not found or access denied');
    }
    
    await folderRepository.deleteFolder(input.id);
  }),
```

### Security Logging Best Practices

Log security events with structured data:

```typescript
// Successful operation
logger.info(
  { folderId: input.id, userId: ctx.user.id },
  'User accessed folder'
);

// Access denied
logger.warn(
  { folderId: input.id, userId: ctx.user.id },
  'Unauthorized folder access attempt'
);

// Security violation
logger.error(
  { requestId, userId, suspiciousActivity: true },
  'Potential security violation detected'
);
```

### Repository Function Naming Conventions

- **Standard functions**: `getEntityById()`, `getEntities()`
- **User-scoped functions**: `getEntityByIdForUser()`, `getEntitiesByUserId()`
- **Ownership checks**: `userOwnsEntity()`, `userCanAccessEntity()`
- **Security validators**: `validateEntityAccess()`, `checkEntityPermission()`

### Security Best Practices

- **Fail Secure**: Return `null` or `false` when ownership checks fail
- **Input Validation**: Always validate user input with Zod schemas
- **User Context**: Pass authenticated user ID to all data access functions
- **Audit Trail**: Log all access attempts and authorization failures
- **Error Handling**: Don't leak information in error messages
- **Database Constraints**: Use database-level constraints for data integrity

### Common Security Patterns

#### 1. User-Scoped Data Access
```typescript
// Always filter by user ID at database level
where: { 
  createdById: userId,
  archivedAt: null 
}
```

#### 2. Ownership Validation Before Operations
```typescript
// Check ownership before any modification
const entity = await repository.getEntityByIdForUser(id, userId);
if (!entity) {
  throw new Error('Entity not found or access denied');
}
```

#### 3. Related Entity Access Control
```typescript
// Check ownership through relationships
const hasAccess = await repository.userOwnsRequestFolder(requestId, userId);
if (!hasAccess) {
  throw new Error('Access denied');
}
```
