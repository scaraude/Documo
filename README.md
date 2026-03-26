# Documo

**l'échange de document à l'ère moderne**

Documo is a modern, secure document transfer platform that simplifies the exchange of documents between organizations and citizens.

## Features

- 🔐 **Secure Document Transfer**: End-to-end encrypted document sharing
- 📧 **Email-based Requests**: Simple email-driven document request workflow
- 👤 **User Authentication**: Secure user registration and email verification
- 📁 **Folder Management**: Organize documents in structured folders
- 🕒 **Request Tracking**: Monitor the status of document requests
- 🌐 **Modern Web Interface**: Responsive design with Tailwind CSS

## Getting Started

First, set up your environment variables by copying the example file:

```bash
cp .env.example .env.local
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom email-based auth system
- **Email**: Resend with React Email templates
- **API**: tRPC for type-safe APIs
- **Testing**: Jest, Playwright for E2E testing
- **Package Manager**: pnpm

## Development Commands

- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm test`: Run unit tests
- `pnpm test:e2e`: Run end-to-end tests
- `pnpm lint`: Run ESLint
- `pnpm prisma:studio`: Open Prisma database UI

## Project Structure

```
├── app/                 # Next.js App Router pages and API routes
├── features/           # Domain-specific logic and components
├── shared/             # Reusable components and utilities
├── lib/                # Utility functions and configurations
├── prisma/             # Database schema and migrations
└── public/             # Static assets
```

## Contributing

Please read our development guidelines in `CLAUDE.md` for coding standards and best practices.

## License

This project is private and proprietary.
