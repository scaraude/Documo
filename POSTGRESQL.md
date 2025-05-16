# PostgreSQL Integration Guide for Document Transfer App

This guide outlines how to set up and use PostgreSQL with the Document Transfer App.

## Prerequisites

- Docker and Docker Compose (for local development)
- Node.js and Yarn
- PostgreSQL (for production)

## Setup Instructions

### 1. Start the PostgreSQL Database

For local development, use Docker Compose:

```bash
# Start PostgreSQL and pgAdmin
docker-compose up -d

# Check if containers are running
docker-compose ps
```

PostgreSQL will be available at `localhost:5432` with the following credentials:
- Username: postgres
- Password: postgres
- Database: document_transfer_db

pgAdmin will be available at http://localhost:5050 with:
- Email: admin@admin.com
- Password: pgadmin

### 2. Set Up Environment Variables

Create a `.env` file based on the `.env.development` example:

```bash
cp .env.development .env
```

Customize the `DATABASE_URL` if needed.

### 3. Generate Prisma Client

```bash
yarn prisma:generate
```

### 4. Run Migrations

```bash
yarn prisma:migrate
```

This will create all necessary database tables.

### 5. Seed the Database (Optional)

```bash
npx prisma db seed
```

This will populate the database with initial data for development.

### 6. Explore the Database (Optional)

```bash
yarn prisma:studio
```

Prisma Studio will open in your browser, providing a visual interface to view and edit your data.

## Usage

The application now uses Prisma Client to interact with PostgreSQL. All database operations are handled through Prisma models defined in `prisma/schema.prisma`.

### Database Operations

Prisma simplifies common database operations:

```typescript
// Example: Fetch all document requests
const requests = await prisma.documentRequest.findMany();

// Example: Create a new template
const template = await prisma.requestTemplate.create({
  data: {
    title: 'New Template',
    requestedDocuments: ['IDENTITY_CARD', 'UTILITY_BILL'],
  },
});

// Example: Update a request status
const updatedRequest = await prisma.documentRequest.update({
  where: { id: requestId },
  data: { status: 'ACCEPTED' },
});

// Example: Delete a template
await prisma.requestTemplate.delete({
  where: { id: templateId },
});
```

## Best Practices

1. Always use the Prisma client for database operations
2. Use transactions for related operations
3. Implement proper error handling for database queries
4. Keep sensitive information in environment variables

## Production Deployment

For production, make sure to:

1. Set up a production PostgreSQL database
2. Update the `DATABASE_URL` environment variable
3. Run migrations in production using `yarn prisma:deploy`
4. Ensure database credentials are kept secure
