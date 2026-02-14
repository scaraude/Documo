import { expect, test } from '@playwright/test';
import crypto from 'crypto';

type TrpcMutationResponse = {
  result?: {
    data?: {
      json?: {
        verificationToken?: string;
      };
    };
  };
};

function extractVerificationToken(payload: unknown): string | null {
  if (Array.isArray(payload)) {
    const first = payload[0] as TrpcMutationResponse | undefined;
    return first?.result?.data?.json?.verificationToken ?? null;
  }

  const response = payload as TrpcMutationResponse;
  return response?.result?.data?.json?.verificationToken ?? null;
}

test.describe('Email Verification Auto-Login Flow', () => {
  test('should sign up, verify via email link, and land authenticated on folders', async ({
    page,
  }) => {
    const uniqueId = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const email = `verify-flow-${uniqueId}@example.com`;
    const password = 'StrongPass123!';
    const organizationName = `Flow ${uniqueId}`;

    await page.goto('/signup');

    const signupResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/trpc/auth.signup') &&
        response.request().method() === 'POST',
    );

    await page.fill('input#organizationName', organizationName);
    await page.fill('input#email', email);
    await page.fill('input#password', password);
    await page.getByRole('button', { name: 'Créer un compte' }).click();

    await expect(page).toHaveURL(/\/verify-email$/);

    const signupResponse = await signupResponsePromise;
    expect(signupResponse.ok()).toBeTruthy();

    const signupPayload = await signupResponse.json();
    const verificationToken = extractVerificationToken(signupPayload);
    expect(verificationToken).toBeTruthy();

    await page.goto(`/verify-email?token=${verificationToken}`);

    await expect(page).toHaveURL(/\/folders$/, { timeout: 15000 });

    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find((cookie) => cookie.name === 'session');
    expect(sessionCookie?.value).toBeTruthy();
  });
});
