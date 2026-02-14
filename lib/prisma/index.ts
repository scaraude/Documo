import { isDevelopment, isProduction } from '@/lib/config/env';
import { getPrismaClientOptions } from './clientOptions';
import { PrismaClient } from './generated/client';

// Exporter explicitement le namespace Prisma
export { Prisma } from './generated/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    ...getPrismaClientOptions(),
    log: isDevelopment ? ['error', 'warn'] : ['error'],
  });

if (!isProduction) globalForPrisma.prisma = prisma;
