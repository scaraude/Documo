import { AuthRepository } from '@/features/auth/repository/authRepository';
import type { Organization, OrganizationSession } from '@/features/auth/types';
import { prisma } from '@/lib/prisma';
import { TRPCError, initTRPC } from '@trpc/server';
import type { NextRequest } from 'next/server';
import superjson from 'superjson';

interface Context {
  req?: NextRequest;
  resHeaders?: Headers;
  organization?: Organization;
  session?: OrganizationSession;
}

const authRepository = new AuthRepository(prisma);

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  // Get session token from cookie
  const sessionToken = ctx.req?.cookies.get('session')?.value;

  if (!sessionToken) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'No session token provided',
    });
  }

  // Validate session
  const sessionWithOrganization =
    await authRepository.findSessionByToken(sessionToken);

  if (!sessionWithOrganization) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid or expired session',
    });
  }

  return next({
    ctx: {
      ...ctx,
      organization: sessionWithOrganization.organization,
      session: sessionWithOrganization,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthenticated);

export const createTRPCRouter = t.router;
