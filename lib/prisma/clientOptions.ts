import { Prisma, type PrismaClient } from './generated/client';

type AdapterConstructor = new (pool: unknown) => unknown;
type PoolConstructor = new (options: { connectionString: string }) => unknown;

const prismaMajorVersion = Number.parseInt(
  Prisma.prismaVersion.client.split('.')[0] ?? '0',
  10,
);

export function getPrismaClientOptions(): PrismaClientOptions {
  if (prismaMajorVersion < 7) {
    return {};
  }

  const databaseUrl = process.env.DATABASE_URL ?? process.env.TEST_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      'Prisma 7 requires DATABASE_URL (or TEST_DATABASE_URL) to initialize PrismaClient.',
    );
  }

  try {
    const { PrismaPg } = require('@prisma/adapter-pg') as {
      PrismaPg: AdapterConstructor;
    };
    const { Pool } = require('pg') as { Pool: PoolConstructor };

    return {
      adapter: new PrismaPg(new Pool({ connectionString: databaseUrl })),
    } as PrismaClientOptions;
  } catch {
    throw new Error(
      'Prisma 7 requires a driver adapter for direct connections. Install @prisma/adapter-pg and pg, or configure Accelerate and pass accelerateUrl.',
    );
  }
}
type PrismaClientOptions = NonNullable<
  ConstructorParameters<typeof PrismaClient>[0]
>;
