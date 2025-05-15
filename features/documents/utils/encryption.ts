export async function generateEncryptionKey(): Promise<CryptoKey> {
    return window.crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256
        },
        true,
        ['encrypt', 'decrypt']
    );
}

export async function encryptFile(file: File, key: CryptoKey): Promise<File> {
    const buffer = await file.arrayBuffer();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv
        },
        key,
        buffer
    );

    // Combine IV and encrypted data
    const combinedBuffer = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combinedBuffer.set(iv);
    combinedBuffer.set(new Uint8Array(encryptedBuffer), iv.length);

    return new File([combinedBuffer], file.name, {
        type: file.type,
        lastModified: file.lastModified
    });
}

export async function decryptFile(encryptedFile: File, key: CryptoKey): Promise<File> {
    const buffer = await encryptedFile.arrayBuffer();
    const iv = new Uint8Array(buffer.slice(0, 12));
    const encryptedData = buffer.slice(12);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv
        },
        key,
        encryptedData
    );

    return new File([decryptedBuffer], encryptedFile.name, {
        type: encryptedFile.type,
        lastModified: encryptedFile.lastModified
    });
}

export async function generateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    // Use crypto instead of window.crypto to work in both browser and Node environments
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}