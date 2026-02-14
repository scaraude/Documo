export interface Organization {
  id: string;
  email: string;
  name: string;
  civilId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthProvider {
  id: string;
  organizationId: string;
  providerType: ProviderType;
  providerId: string;
  isVerified: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationSession {
  id: string;
  organizationId: string;
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

enum ProviderType {
  EMAIL_PASSWORD = 'EMAIL_PASSWORD',
  FRANCE_CONNECT = 'FRANCE_CONNECT',
}

export interface AuthContextValue {
  organization: Organization | null;
  session: OrganizationSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    organizationName: string,
  ) => Promise<{
    success: boolean;
    message: string;
    organizationId: string;
    verificationToken?: string;
  }>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<{
    success: boolean;
    message: string;
    autoLogin: boolean;
    organization?: Organization;
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
  resetPassword: (
    token: string,
    password: string,
  ) => Promise<{
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
  organizationName: string;
}

interface AuthError {
  code: string;
  message: string;
}
