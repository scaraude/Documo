import { generateEncryptionKey, encryptFile, decryptFile, generateFileHash } from '../encryption';

// Mock crypto API methods
const mockGenerateKey = jest.fn();
const mockEncrypt = jest.fn();
const mockDecrypt = jest.fn();
const mockDigest = jest.fn();
const mockGetRandomValues = jest.fn();
const mockArrayBuffer = jest.fn();

// Setup crypto mock
Object.defineProperty(global, 'crypto', {
    value: {
        subtle: {
            generateKey: mockGenerateKey,
            encrypt: mockEncrypt,
            decrypt: mockDecrypt,
            digest: mockDigest
        },
        getRandomValues: mockGetRandomValues
    }
});

describe('Encryption Utils', () => {
    const mockCryptoKey = { type: 'secret', algorithm: { name: 'AES-GCM' } } as CryptoKey;

    beforeEach(() => {
        jest.clearAllMocks();
        File.prototype.arrayBuffer = mockArrayBuffer;
        mockGetRandomValues.mockImplementation(array => array);
        mockDigest.mockResolvedValue(new ArrayBuffer(32));
    });

    describe('generateEncryptionKey', () => {
        test('generates AES-GCM key successfully', async () => {
            mockGenerateKey.mockResolvedValue(mockCryptoKey);

            const key = await generateEncryptionKey();

            expect(mockGenerateKey).toHaveBeenCalledWith(
                {
                    name: 'AES-GCM',
                    length: 256
                },
                true,
                ['encrypt', 'decrypt']
            );
            expect(key).toBe(mockCryptoKey);
        });
    });

    describe('encryptFile', () => {
        test('encrypts file successfully', async () => {
            const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
            const mockEncryptedBuffer = new ArrayBuffer(100);

            mockArrayBuffer.mockResolvedValue(new ArrayBuffer(4));
            mockEncrypt.mockResolvedValue(mockEncryptedBuffer);

            const encryptedFile = await encryptFile(mockFile, mockCryptoKey);

            expect(mockEncrypt).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'AES-GCM',
                    iv: expect.any(Uint8Array)
                }),
                mockCryptoKey,
                expect.any(ArrayBuffer)
            );
            expect(encryptedFile).toBeInstanceOf(File);
            expect(encryptedFile.name).toBe(mockFile.name);
            expect(encryptedFile.type).toBe(mockFile.type);
        });
    });

    describe('decryptFile', () => {
        test('decrypts file successfully', async () => {
            const mockEncryptedFile = new File([new ArrayBuffer(116)], 'test.txt');
            const mockDecryptedBuffer = new ArrayBuffer(100);

            mockArrayBuffer.mockResolvedValue(new ArrayBuffer(116));
            mockDecrypt.mockResolvedValue(mockDecryptedBuffer);

            const decryptedFile = await decryptFile(mockEncryptedFile, mockCryptoKey);

            expect(mockDecrypt).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'AES-GCM',
                    iv: expect.any(Uint8Array)
                }),
                mockCryptoKey,
                expect.any(ArrayBuffer)
            );
            expect(decryptedFile).toBeInstanceOf(File);
            expect(decryptedFile.name).toBe(mockEncryptedFile.name);
        });

        test('handles decryption error', async () => {
            const mockEncryptedFile = new File([new ArrayBuffer(116)], 'test.txt');
            mockArrayBuffer.mockResolvedValue(new ArrayBuffer(116));
            mockDecrypt.mockRejectedValue(new Error('Decryption failed'));

            await expect(decryptFile(mockEncryptedFile, mockCryptoKey))
                .rejects.toThrow('Decryption failed');
        });
    });

    describe('generateFileHash', () => {
        test('generates consistent hash for same file content', async () => {
            const buffer = new ArrayBuffer(8);
            mockArrayBuffer.mockResolvedValue(buffer);
            mockDigest.mockResolvedValue(new ArrayBuffer(32)); // SHA-256 produces 32 bytes

            const fileContent = 'test content';
            const file1 = new File([fileContent], 'test1.txt', { type: 'text/plain' });
            const file2 = new File([fileContent], 'test2.txt', { type: 'text/plain' });

            const hash1 = await generateFileHash(file1);
            const hash2 = await generateFileHash(file2);

            expect(hash1).toBe(hash2);
            expect(mockArrayBuffer).toHaveBeenCalledTimes(2);
            expect(mockDigest).toHaveBeenCalledWith('SHA-256', buffer);
        });

        test('generates different hashes for different content', async () => {
            const buffer1 = new ArrayBuffer(8);
            const buffer2 = new ArrayBuffer(16);
            mockArrayBuffer
                .mockResolvedValueOnce(buffer1)
                .mockResolvedValueOnce(buffer2);
            mockDigest
                .mockResolvedValueOnce(new ArrayBuffer(32))
                .mockResolvedValueOnce(new ArrayBuffer(16));

            const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
            const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });

            const hash1 = await generateFileHash(file1);
            const hash2 = await generateFileHash(file2);

            expect(hash1).not.toBe(hash2);
            expect(mockDigest).toHaveBeenCalledTimes(2);
        });

        test('handles empty files', async () => {
            const buffer = new ArrayBuffer(0);
            mockArrayBuffer.mockResolvedValue(buffer);
            mockDigest.mockResolvedValue(new ArrayBuffer(32));

            const emptyFile = new File([''], 'empty.txt', { type: 'text/plain' });

            const hash = await generateFileHash(emptyFile);

            expect(hash).toBeTruthy();
            expect(typeof hash).toBe('string');
            expect(mockArrayBuffer).toHaveBeenCalledTimes(1);
            expect(mockDigest).toHaveBeenCalledWith('SHA-256', buffer);
        });

        test('handles large files', async () => {
            const largeContent = 'x'.repeat(1024 * 1024); // 1MB of content
            const buffer = new ArrayBuffer(1024 * 1024);
            mockArrayBuffer.mockResolvedValue(buffer);
            mockDigest.mockResolvedValue(new ArrayBuffer(32));

            const largeFile = new File([largeContent], 'large.txt', { type: 'text/plain' });

            const hash = await generateFileHash(largeFile);

            expect(hash).toBeTruthy();
            expect(typeof hash).toBe('string');
            expect(mockArrayBuffer).toHaveBeenCalledTimes(1);
            expect(mockDigest).toHaveBeenCalledWith('SHA-256', buffer);
        });
    });
});
