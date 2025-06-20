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
- `yarn lint`: Run ESLint
- `yarn test`: Run unit tests
- `yarn test:integration`: Run integration tests with database isolation
- `yarn test:integration:watch`: Run integration tests in watch mode
- `yarn test:setup-db`: Setup test database with Docker
- `yarn test:teardown-db`: Teardown test database Docker container
- `yarn test:seed`: Manually seed test database with test data
- `yarn test:workflow`: Run the complete test workflow with database setup
- `yarn test:e2e`: Run end-to-end tests with Playwright
- `yarn test:e2e:ui`: Run E2E tests with Playwright UI mode
- `yarn test:e2e:headed`: Run E2E tests with visible browser
- `yarn test:e2e:workflow`: Run complete E2E workflow with setup and teardown
- `yarn test path/to/test`: Run a specific test file
- `yarn test:watch`: Run tests in watch mode
- `yarn prisma:generate`: Generate Prisma client
- `yarn prisma:migrate`: Run database migrations
- `yarn prisma:studio`: Open Prisma database UI
- `yarn unused`: Check for unused files/exports
- `yarn check-env`: Verify environment variables in .env file
- `yarn check-env:dev`: Verify environment variables in .env.development file
- `yarn check-env:test`: Verify environment variables in .env.test file

## Code Style Guidelines

- TypeScript: Use strict typing with interfaces/types in separate files
- Import order: React, external libs, shared, features, local
- Naming: PascalCase for components/types, camelCase for variables/functions
- Components: Functional components with explicit props interfaces
- State: Use hooks (useState, useReducer) with typed state
- Error handling: Try/catch with specific error messages
- Repository pattern: Data access in repository files, API in api files
- Testing: Component tests with React Testing Library, repository tests with mocks
- Documentation: JSDoc comments for functions and types
- Logging: Use structured logging with Pino logger (see Logging section)

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

- **Unit Tests**: Write unit tests for components, hooks, and repositories.
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
