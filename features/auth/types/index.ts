export interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  civilId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthProvider {
  id: string;
  userId: string;
  providerType: ProviderType;
  providerId: string;
  isVerified: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt: Date | null;
  userAgent: string | null;
  ipAddress: string | null;
}

export interface EmailVerificationToken {
  id: string;
  email: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  usedAt: Date | null;
}

export enum ProviderType {
  EMAIL_PASSWORD = 'EMAIL_PASSWORD',
  FRANCE_CONNECT = 'FRANCE_CONNECT',
}

export interface AuthContextValue {
  user: User | null;
  session: UserSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{
    success: boolean;
    message: string;
    userId: string;
    verificationToken?: string;
  }>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<{
    success: boolean;
    message: string;
  }>;
  resendVerification: (email: string) => Promise<{
    success: boolean;
    message: string;
    verificationToken?: string;
  }>;
  forgotPassword: (email: string) => Promise<{
    success: boolean;
    message: string;
  }>;
  resetPassword: (token: string, password: string) => Promise<{
    success: boolean;
    message: string;
  }>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthError {
  code: string;
  message: string;
}