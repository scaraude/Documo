import { isDevelopment, isProduction } from '@/lib/config/env';
import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/email';
import logger from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/lib/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { AuthRepository } from '../repository/authRepository';
import {
  forgotPasswordSchema,
  loginSchema,
  resendVerificationSchema,
  resetPasswordApiSchema,
  signupApiSchema,
  verifyEmailSchema,
} from '../types/zod';

const authRepository = new AuthRepository(prisma);

export const authRouter = createTRPCRouter({
  signup: publicProcedure.input(signupApiSchema).mutation(async ({ input }) => {
    try {
      logger.info('Starting signup process');
      const organization = await authRepository.createOrganization(input);

      const verificationToken =
        await authRepository.createEmailVerificationToken(organization.email);

      const emailResult = await sendVerificationEmail({
        to: organization.email,
        organizationName: organization.name,
        verificationToken: verificationToken.token,
      });

      if (!emailResult.success) {
        logger.error(
          {
            organizationId: organization.id,
            email: organization.email,
            error: emailResult.error,
            operation: 'auth.signup',
          },
          'Failed to send verification email during signup',
        );
      }

      logger.info(
        {
          organizationId: organization.id,
          email: organization.email,
          emailSent: emailResult.success,
          operation: 'auth.signup',
        },
        'Organization signed up, verification email sent',
      );

      return {
        success: true,
        message:
          'Account created successfully. Please check your email to verify your account.',
        organizationId: organization.id,
        ...(isDevelopment && {
          verificationToken: verificationToken.token,
        }),
      };
    } catch (error) {
      logger.error(
        { input: { email: input.email }, error: (error as Error).message },
        'Signup failed',
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
      const organization = await authRepository.authenticateOrganization(input);

      if (!organization) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'email ou mot de passe incorrect',
        });
      }

      const session = await authRepository.createSession(
        organization.id,
        ctx.req?.headers.get('user-agent') || undefined,
        ctx.req?.headers.get('x-forwarded-for') ||
          ctx.req?.headers.get('x-real-ip') ||
          undefined,
      );

      if (ctx.resHeaders) {
        const cookieValue = `session=${session.token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; HttpOnly; ${isProduction ? 'Secure; ' : ''}SameSite=lax`;
        ctx.resHeaders.set('Set-Cookie', cookieValue);
      }

      return {
        success: true,
        organization: {
          id: organization.id,
          email: organization.email,
          name: organization.name,
        },
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      if ((error as Error).message === 'UNVERIFIED_EMAIL') {
        throw error;
      }

      logger.error(
        { input: { email: input.email }, error: (error as Error).message },
        'Login failed',
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

      if (ctx.resHeaders) {
        const cookieValue = `session=; Path=/; Max-Age=0; HttpOnly; ${isProduction ? 'Secure; ' : ''}SameSite=lax`;
        ctx.resHeaders.set('Set-Cookie', cookieValue);
      }

      logger.info(
        {
          organizationId: ctx.organization?.id,
          operation: 'auth.logout.success',
        },
        'Organization logged out successfully',
      );
      return { success: true };
    } catch (error) {
      logger.error(
        {
          organizationId: ctx.organization?.id,
          error: (error as Error).message,
        },
        'Logout failed',
      );
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Logout failed',
      });
    }
  }),

  verifyEmail: publicProcedure
    .input(verifyEmailSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const verificationToken = await prisma.emailVerificationToken.findFirst(
          {
            where: { token: input.token },
            select: { email: true, usedAt: true },
          },
        );

        const success = await authRepository.verifyEmail(input.token);

        if (!success) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid or expired verification token',
          });
        }

        if (verificationToken?.email && !verificationToken.usedAt) {
          const organization = await authRepository.findOrganizationByEmail(
            verificationToken.email,
          );

          if (organization) {
            const session = await authRepository.createSession(
              organization.id,
              ctx.req?.headers.get('user-agent') || undefined,
              ctx.req?.headers.get('x-forwarded-for') ||
                ctx.req?.headers.get('x-real-ip') ||
                undefined,
            );

            if (ctx.resHeaders) {
              const cookieValue = `session=${session.token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; HttpOnly; ${isProduction ? 'Secure; ' : ''}SameSite=lax`;
              ctx.resHeaders.set('Set-Cookie', cookieValue);
            }

            return {
              success: true,
              message: 'Email verified successfully. You are now logged in.',
              autoLogin: true,
              organization: {
                id: organization.id,
                email: organization.email,
                name: organization.name,
              },
            };
          }
        }

        return {
          success: true,
          message: 'Email verified successfully. You can now log in.',
          autoLogin: false,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        logger.error(
          {
            token: `${input.token.substring(0, 8)}...`,
            error: (error as Error).message,
          },
          'Email verification failed',
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
        const organization = await authRepository.findOrganizationByEmail(
          input.email,
        );

        if (!organization) {
          return {
            success: true,
            message:
              'If an account with this email exists, a verification email has been sent.',
          };
        }

        const authProvider = await prisma.authProvider.findFirst({
          where: {
            organizationId: organization.id,
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
          await authRepository.createEmailVerificationToken(organization.email);

        const emailResult = await sendVerificationEmail({
          to: organization.email,
          organizationName: organization.name,
          verificationToken: verificationToken.token,
        });

        if (!emailResult.success) {
          logger.error(
            {
              organizationId: organization.id,
              email: organization.email,
              error: emailResult.error,
              operation: 'auth.resendVerification',
            },
            'Failed to resend verification email',
          );
        }

        logger.info(
          {
            organizationId: organization.id,
            email: organization.email,
            emailSent: emailResult.success,
            operation: 'auth.resendVerification',
          },
          'Verification email resent',
        );

        return {
          success: true,
          message: 'Verification email sent. Please check your inbox.',
          ...(isDevelopment && {
            verificationToken: verificationToken.token,
          }),
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        logger.error(
          { email: input.email, error: (error as Error).message },
          'Resend verification failed',
        );
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to resend verification email',
        });
      }
    }),

  me: protectedProcedure.query(({ ctx }) => {
    return {
      id: ctx.organization.id,
      email: ctx.organization.email,
      name: ctx.organization.name,
    };
  }),

  sessions: protectedProcedure.query(async ({ ctx }) => {
    try {
      const sessions = await prisma.organizationSession.findMany({
        where: {
          organizationId: ctx.organization.id,
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
        {
          organizationId: ctx.organization.id,
          error: (error as Error).message,
        },
        'Failed to fetch sessions',
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
        const session = await prisma.organizationSession.findFirst({
          where: {
            id: input.sessionId,
            organizationId: ctx.organization.id,
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
            organizationId: ctx.organization.id,
            sessionId: input.sessionId,
            error: (error as Error).message,
          },
          'Failed to revoke session',
        );

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to revoke session',
        });
      }
    }),

  checkEmailVerification: publicProcedure
    .input(
      z.object({
        email: z
          .string()
          .email()
          .transform((email) => email.toLowerCase()),
      }),
    )
    .query(async ({ input }) => {
      try {
        const isVerified = await authRepository.isEmailVerified(input.email);
        return { isVerified };
      } catch (error) {
        logger.error(
          { email: input.email, error: (error as Error).message },
          'Failed to check email verification',
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
          input.email,
        );

        if (token !== 'fake-token') {
          const organization = await authRepository.findOrganizationByEmail(
            input.email,
          );

          const emailResult = await sendPasswordResetEmail({
            to: input.email,
            organizationName: organization?.name,
            resetToken: token,
          });

          if (!emailResult.success) {
            logger.error(
              {
                email: input.email,
                error: emailResult.error,
                operation: 'auth.forgotPassword.email_failed',
              },
              'Failed to send password reset email',
            );
          }

          logger.info(
            {
              email: input.email,
              emailSent: emailResult.success,
              operation: 'auth.forgotPassword',
            },
            'Password reset token created',
          );
        } else {
          logger.info(
            { email: input.email, operation: 'auth.forgotPassword.fake_token' },
            'Fake token returned for non-existent email',
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
          'Forgot password failed',
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
          input.password,
        );

        if (!success) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid or expired reset token',
          });
        }

        logger.info(
          {
            token: `${input.token.substring(0, 8)}...`,
            operation: 'auth.resetPassword',
          },
          'Password reset successful',
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
            token: `${input.token.substring(0, 8)}...`,
            error: (error as Error).message,
          },
          'Reset password failed',
        );
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to reset password',
        });
      }
    }),
});
