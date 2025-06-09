# CLAUDE.md
# Codebase-Specific Instructions for LLM Development

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
- `yarn test path/to/test`: Run a specific test file
- `yarn test:watch`: Run tests in watch mode
- `yarn prisma:generate`: Generate Prisma client
- `yarn prisma:migrate`: Run database migrations
- `yarn prisma:studio`: Open Prisma database UI
- `yarn unused`: Check for unused files/exports

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

## User Stories
- When the user arrives on the homepage for the first time, they see the "Create a new file type" CTA, and the "Create a new file" CTA is greyed out with an overlay saying "Create a new file type first".
- When the user creates a new file type, they are asked for a name, a description, and the required documents. They can also add new fields (e.g., [Address: text, required: true]). Once confirmed, the new file type is added.
- When the user creates a new file, they first select the file type, add a reference and the required fields, then add one or more IDs for the people from whom documents will be requested.
They can also arrive via a direct link, for example from the detail page of a file type. In this case, the file type selection step is skipped, and they only see the details of the pre-selected file type.
- In the request details, there is a way to redirect an external user to the document upload page.
- When an external user arrives via the link they received, they are prompted to log in with FranceConnect, and as little as possible via the traditional email + code method. After authentication, they see a list of missing documents for their account, with drop zones to upload them. Once the documents are uploaded, they receive confirmation that the documents have been submitted and that they will never have to upload them again.