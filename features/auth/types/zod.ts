import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Adresse email invalide').transform(email => email.toLowerCase()),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

// Frontend form schema with password confirmation
export const signupSchema = z.object({
  email: z.string().email('Adresse email invalide').transform(email => email.toLowerCase()),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string().min(1, 'Veuillez confirmer votre mot de passe'),
  firstName: z.string().min(1, 'Le prénom est requis').max(50),
  lastName: z.string().min(1, 'Le nom est requis').max(50),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

// Backend API schema without password confirmation
export const signupApiSchema = z.object({
  email: z.string().email('Adresse email invalide').transform(email => email.toLowerCase()),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  firstName: z.string().min(1, 'Le prénom est requis').max(50),
  lastName: z.string().min(1, 'Le nom est requis').max(50),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Le token est requis'),
});

export const resendVerificationSchema = z.object({
  email: z.string().email('Adresse email invalide').transform(email => email.toLowerCase()),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Adresse email invalide').transform(email => email.toLowerCase()),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Le token est requis'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string().min(1, 'Veuillez confirmer votre mot de passe'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export const resetPasswordApiSchema = z.object({
  token: z.string().min(1, 'Le token est requis'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
  newPassword: z.string().min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type SignupApiInput = z.infer<typeof signupApiSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordApiInput = z.infer<typeof resetPasswordApiSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;