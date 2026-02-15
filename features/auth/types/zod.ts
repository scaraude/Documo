import { z } from 'zod';

// Strong password validation
const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
  .regex(
    /[^A-Za-z0-9]/,
    'Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*)',
  );

// Export password requirements for UI display
export const passwordRequirements = [
  'Au moins 8 caractères',
  'Au moins une lettre minuscule (a-z)',
  'Au moins une lettre majuscule (A-Z)',
  'Au moins un chiffre (0-9)',
  'Au moins un caractère spécial (!@#$%^&*)',
];

// Helper function to validate password and return specific errors
export const validatePassword = (password: string) => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  if (password.length > 128) {
    errors.push('Le mot de passe ne peut pas dépasser 128 caractères');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre minuscule');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre majuscule');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push(
      'Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*)',
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const loginSchema = z.object({
  email: z
    .string()
    .email('Adresse email invalide')
    .transform((email) => email.toLowerCase()),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

// Frontend form schema with password confirmation
export const signupSchema = z.object({
  email: z
    .string()
    .email('Adresse email invalide')
    .transform((email) => email.toLowerCase()),
  password: passwordSchema,
  organizationName: z
    .string()
    .min(1, "Le nom de l'organisation est requis")
    .max(120),
});

// Backend API schema without password confirmation
export const signupApiSchema = z.object({
  email: z
    .string()
    .email('Adresse email invalide')
    .transform((email) => email.toLowerCase()),
  password: passwordSchema,
  organizationName: z
    .string()
    .min(1, "Le nom de l'organisation est requis")
    .max(120),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Le token est requis'),
});

export const resendVerificationSchema = z.object({
  email: z
    .string()
    .email('Adresse email invalide')
    .transform((email) => email.toLowerCase()),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email('Adresse email invalide')
    .transform((email) => email.toLowerCase()),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Le token est requis'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Veuillez confirmer votre mot de passe'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export const resetPasswordApiSchema = z.object({
  token: z.string().min(1, 'Le token est requis'),
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
