import { initTRPC, TRPCError } from '@trpc/server';
import { NextRequest } from 'next/server';
import superjson from 'superjson';
import { AuthRepository } from '@/features/auth/repository/authRepository';
import { prisma } from '@/lib/prisma';
import type { User, UserSession } from '@/features/auth/types';

interface Context {
  req?: NextRequest;
  resHeaders?: Headers;
  user?: User;
  session?: UserSession;
}

const authRepository = new AuthRepository(prisma);

export const t = initTRPC.context<Context>().create({
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
  const sessionWithUser = await authRepository.findSessionByToken(sessionToken);
  
  if (!sessionWithUser) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid or expired session',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: sessionWithUser.user,
      session: sessionWithUser,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthenticated);

export const createTRPCRouter = t.router;