import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from '@/lib/trpc/trpc';
import { AuthRepository } from '../repository/authRepository';
import { prisma } from '@/lib/prisma';
import {
  loginSchema,
  signupApiSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordApiSchema,
} from '../types/zod';
import logger from '@/lib/logger';
import { sendVerificationEmail, sendPasswordResetEmail } from '@/lib/email';

const authRepository = new AuthRepository(prisma);

export const authRouter = createTRPCRouter({
  signup: publicProcedure.input(signupApiSchema).mutation(async ({ input }) => {
    try {
      logger.info('Starting signup process');
      const user = await authRepository.createUser(input);

      // Create email verification token
      const verificationToken =
        await authRepository.createEmailVerificationToken(user.email!);

      // Send verification email
      const emailResult = await sendVerificationEmail({
        to: user.email!,
        firstName: user.firstName || 'User',
        verificationToken: verificationToken.token,
      });

      if (!emailResult.success) {
        logger.error(
          {
            userId: user.id,
            email: user.email,
            error: emailResult.error,
            operation: 'auth.signup',
          },
          'Failed to send verification email during signup'
        );
      }

      logger.info(
        {
          userId: user.id,
          email: user.email,
          emailSent: emailResult.success,
          operation: 'auth.signup',
        },
        'User signed up, verification email sent'
      );

      return {
        success: true,
        message:
          'Account created successfully. Please check your email to verify your account.',
        userId: user.id,
        // In development, return the token for testing
        ...(process.env.NODE_ENV === 'production' && {
          verificationToken: verificationToken.token,
        }),
      };
    } catch (error) {
      logger.error(
        { input: { email: input.email }, error: (error as Error).message },
        'Signup failed'
      );

      if ((error as Error).message.includes('already exists')) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'An account with this email already exists',
        });
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create account',
      });
    }
  }),

  login: publicProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    try {
      const user = await authRepository.authenticateUser(input);

      if (!user) {
        console.log('Login failed: User not found or password mismatch');
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'email ou mot de passe incorrect',
        });
      }

      // Create session
      const session = await authRepository.createSession(
        user.id,
        ctx.req?.headers.get('user-agent') || undefined,
        ctx.req?.headers.get('x-forwarded-for') ||
          ctx.req?.headers.get('x-real-ip') ||
          undefined
      );

      // Set session cookie
      if (ctx.resHeaders) {
        const cookieValue = `session=${session.token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; HttpOnly; ${process.env.NODE_ENV === 'production' ? 'Secure; ' : ''}SameSite=lax`;
        ctx.resHeaders.set('Set-Cookie', cookieValue);
      }

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      // Handle specific unverified email error
      if ((error as Error).message === 'UNVERIFIED_EMAIL') {
        throw error;
      }

      logger.error(
        { input: { email: input.email }, error: (error as Error).message },
        'Login failed'
      );
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Login failed',
      });
    }
  }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      if (ctx.session) {
        await authRepository.revokeSession(ctx.session.id);
      }

      // Clear session cookie using resHeaders
      if (ctx.resHeaders) {
        const cookieValue = `session=; Path=/; Max-Age=0; HttpOnly; ${process.env.NODE_ENV === 'production' ? 'Secure; ' : ''}SameSite=lax`;
        ctx.resHeaders.set('Set-Cookie', cookieValue);
      }

      logger.info(
        { userId: ctx.user?.id, operation: 'auth.logout.success' },
        'User logged out successfully'
      );
      return { success: true };
    } catch (error) {
      logger.error(
        { userId: ctx.user?.id, error: (error as Error).message },
        'Logout failed'
      );
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Logout failed',
      });
    }
  }),

  verifyEmail: publicProcedure
    .input(verifyEmailSchema)
    .mutation(async ({ input }) => {
      try {
        const success = await authRepository.verifyEmail(input.token);

        if (!success) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid or expired verification token',
          });
        }

        return {
          success: true,
          message: 'Email verified successfully. You can now log in.',
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        logger.error(
          {
            token: input.token.substring(0, 8) + '...',
            error: (error as Error).message,
          },
          'Email verification failed'
        );
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Email verification failed',
        });
      }
    }),

  resendVerification: publicProcedure
    .input(resendVerificationSchema)
    .mutation(async ({ input }) => {
      try {
        const user = await authRepository.findUserByEmail(input.email);

        if (!user) {
          // Don't reveal if user exists or not for security
          return {
            success: true,
            message:
              'If an account with this email exists, a verification email has been sent.',
          };
        }

        // Check if already verified
        const authProvider = await prisma.authProvider.findFirst({
          where: {
            userId: user.id,
            providerType: 'EMAIL_PASSWORD',
          },
        });

        if (authProvider?.isVerified) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Email is already verified',
          });
        }

        const verificationToken =
          await authRepository.createEmailVerificationToken(user.email!);

        // Send verification email
        const emailResult = await sendVerificationEmail({
          to: user.email!,
          firstName: user.firstName || 'User',
          verificationToken: verificationToken.token,
        });

        if (!emailResult.success) {
          logger.error(
            {
              userId: user.id,
              email: user.email,
              error: emailResult.error,
              operation: 'auth.resendVerification',
            },
            'Failed to resend verification email'
          );
        }

        logger.info(
          {
            userId: user.id,
            email: user.email,
            emailSent: emailResult.success,
            operation: 'auth.resendVerification',
          },
          'Verification email resent'
        );

        return {
          success: true,
          message: 'Verification email sent. Please check your inbox.',
          // In development, return the token for testing
          ...(process.env.NODE_ENV === 'development' && {
            verificationToken: verificationToken.token,
          }),
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        logger.error(
          { email: input.email, error: (error as Error).message },
          'Resend verification failed'
        );
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to resend verification email',
        });
      }
    }),

  me: protectedProcedure.query(({ ctx }) => {
    return {
      id: ctx.user.id,
      email: ctx.user.email,
      firstName: ctx.user.firstName,
      lastName: ctx.user.lastName,
    };
  }),

  sessions: protectedProcedure.query(async ({ ctx }) => {
    try {
      const sessions = await prisma.userSession.findMany({
        where: {
          userId: ctx.user.id,
          revokedAt: null,
        },
        select: {
          id: true,
          createdAt: true,
          expiresAt: true,
          userAgent: true,
          ipAddress: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return sessions;
    } catch (error) {
      logger.error(
        { userId: ctx.user.id, error: (error as Error).message },
        'Failed to fetch sessions'
      );
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch sessions',
      });
    }
  }),

  revokeSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Verify the session belongs to the user
        const session = await prisma.userSession.findFirst({
          where: {
            id: input.sessionId,
            userId: ctx.user.id,
            revokedAt: null,
          },
        });

        if (!session) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Session not found',
          });
        }

        await authRepository.revokeSession(input.sessionId);

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        logger.error(
          {
            userId: ctx.user.id,
            sessionId: input.sessionId,
            error: (error as Error).message,
          },
          'Failed to revoke session'
        );

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to revoke session',
        });
      }
    }),

  checkEmailVerification: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      try {
        const isVerified = await authRepository.isEmailVerified(input.email);
        return { isVerified };
      } catch (error) {
        logger.error(
          { email: input.email, error: (error as Error).message },
          'Failed to check email verification'
        );
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to check verification status',
        });
      }
    }),

  forgotPassword: publicProcedure
    .input(forgotPasswordSchema)
    .mutation(async ({ input }) => {
      try {
        const { token } = await authRepository.createPasswordResetToken(
          input.email
        );

        // Only send email if it's a real token (not fake)
        if (token !== 'fake-token') {
          // Get user's first name for personalized email
          const user = await authRepository.findUserByEmail(input.email);

          const emailResult = await sendPasswordResetEmail({
            to: input.email,
            firstName: user?.firstName || undefined,
            resetToken: token,
          });

          if (!emailResult.success) {
            logger.error(
              {
                email: input.email,
                error: emailResult.error,
                operation: 'auth.forgotPassword.email_failed',
              },
              'Failed to send password reset email'
            );
          }

          logger.info(
            {
              email: input.email,
              emailSent: emailResult.success,
              operation: 'auth.forgotPassword',
            },
            'Password reset token created'
          );
        } else {
          logger.info(
            { email: input.email, operation: 'auth.forgotPassword.fake_token' },
            'Fake token returned for non-existent email'
          );
        }

        return {
          success: true,
          message:
            'Si un compte avec cette adresse email existe, un lien de réinitialisation a été envoyé.',
        };
      } catch (error) {
        if (error instanceof Error && error.message.includes('Too many')) {
          throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: error.message,
          });
        }

        logger.error(
          { email: input.email, error: (error as Error).message },
          'Forgot password failed'
        );
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to process password reset request',
        });
      }
    }),

  resetPassword: publicProcedure
    .input(resetPasswordApiSchema)
    .mutation(async ({ input }) => {
      try {
        const success = await authRepository.resetPassword(
          input.token,
          input.password
        );

        if (!success) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid or expired reset token',
          });
        }

        logger.info(
          {
            token: input.token.substring(0, 8) + '...',
            operation: 'auth.resetPassword',
          },
          'Password reset successful'
        );

        return {
          success: true,
          message:
            'Password has been reset successfully. You can now log in with your new password.',
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        logger.error(
          {
            token: input.token.substring(0, 8) + '...',
            error: (error as Error).message,
          },
          'Reset password failed'
        );
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to reset password',
        });
      }
    }),
});
