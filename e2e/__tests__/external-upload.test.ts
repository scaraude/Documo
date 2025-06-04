import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { APP_DOCUMENT_TYPES } from '@/shared/constants';

const prisma = new PrismaClient();

test.describe('External Upload E2E', () => {
    let requestId: string;
    let token: string;

    test.beforeAll(async () => {
        // Create a test request
        const request = await prisma.documentRequest.create({
            data: {
                civilId: 'test-civil-id',
                requestedDocuments: [APP_DOCUMENT_TYPES.IDENTITY_CARD],
                expiresAt: new Date(Date.now() + 86400000) // 24 hours from now
            }
        });
        requestId = request.id;

        // Generate share link
        const shareLink = await prisma.requestShareLink.create({
            data: {
                requestId: request.id,
                token: 'test-token-' + Date.now(),
                expiresAt: new Date(Date.now() + 86400000)
            }
        });
        token = shareLink.token;
    });

    test.afterAll(async () => {
        // Clean up test data
        await prisma.requestShareLink.deleteMany({
            where: { requestId }
        });
        await prisma.documentRequest.delete({
            where: { id: requestId }
        });
    });

    test('should complete full external upload flow', async ({ page }) => {
        // Visit external request page
        await page.goto(`/external/requests/${token}`);

        // Verify request details are displayed
        await expect(page.getByText('Demande de documents')).toBeVisible();
        await expect(page.getByText('Carte d\'identité')).toBeVisible();

        // Click FranceConnect button
        await page.click('text=Continuer avec FranceConnect');

        // Mock FranceConnect authentication
        // Note: This part would need to be adapted based on your actual FranceConnect implementation
        await page.evaluate(() => {
            localStorage.setItem('auth_token', 'mock-france-connect-token');
        });

        // Verify upload interface is displayed
        await expect(page.getByText('Déposer vos documents')).toBeVisible();

        // Upload a test file
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles(['path/to/test/file.pdf']);

        // Wait for upload to complete
        await expect(page.getByText('Document téléchargé avec succès')).toBeVisible();
    });

    test('should handle FranceConnect authentication flow', async ({ page }) => {
        await page.goto(`/external/requests/${token}`);

        // Click FranceConnect button
        await page.click('text=Continuer avec FranceConnect');

        // Verify redirect to FranceConnect
        expect(page.url()).toContain('france-connect');

        // Mock successful authentication
        await page.evaluate(() => {
            localStorage.setItem('auth_token', 'mock-france-connect-token');
        });

        // Verify redirect back to upload page
        await expect(page.getByText('Déposer vos documents')).toBeVisible();
    });

    test('should handle email authentication flow', async ({ page }) => {
        await page.goto(`/external/requests/${token}`);

        // Click email authentication button
        await page.click('text=Continuer avec un email');

        // Enter email
        await page.fill('input[type="email"]', 'test@example.com');
        await page.click('text=Envoyer le code');

        // Mock email code entry
        await page.fill('input[type="text"]', '123456');
        await page.click('text=Vérifier');

        // Verify access to upload interface
        await expect(page.getByText('Déposer vos documents')).toBeVisible();
    });

    test('should persist uploaded documents correctly', async ({ page }) => {
        await page.goto(`/external/requests/${token}`);

        // Mock authentication
        await page.evaluate(() => {
            localStorage.setItem('auth_token', 'mock-france-connect-token');
        });

        // Upload multiple files
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles([
            'path/to/test/id_card.pdf',
            'path/to/test/proof_address.pdf'
        ]);

        // Wait for all uploads to complete
        await expect(page.getByText('Documents téléchargés avec succès')).toBeVisible();

        // Verify documents are stored
        const documents = await prisma.document.findMany({
            where: { requestId }
        });
        expect(documents).toHaveLength(2);
    });

    test('should handle expired tokens', async ({ page }) => {
        // Create an expired share link
        const expiredToken = 'expired-token-' + Date.now();
        await prisma.requestShareLink.create({
            data: {
                requestId,
                token: expiredToken,
                expiresAt: new Date(Date.now() - 86400000) // 24 hours ago
            }
        });

        await page.goto(`/external/requests/${expiredToken}`);

        // Verify error message
        await expect(page.getByText('La demande n\'existe pas ou a expiré')).toBeVisible();
    });
});
