const generateEncryptionKey = async (): Promise<CryptoKey> => {
    return await window.crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256
        },
        true,
        ['encrypt', 'decrypt']
    )
}

export const encryptFile = async (file: File): Promise<{ encryptedFile: Uint8Array, encryptionKey: CryptoKey }> => {
    const key = await generateEncryptionKey()

    const iv = window.crypto.getRandomValues(new Uint8Array(12))
    const fileBuffer = await file.arrayBuffer()

    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv
        },
        key,
        fileBuffer
    )

    const encryptedArray = new Uint8Array(iv.length + encryptedData.byteLength)
    encryptedArray.set(iv, 0)
    encryptedArray.set(new Uint8Array(encryptedData), iv.length)

    return { encryptedFile: encryptedArray, encryptionKey: key }
}

export const getExportedKeyBase64 = async (key: CryptoKey): Promise<string> => {
    const exportedKey = await window.crypto.subtle.exportKey('raw', key)
    return btoa(String.fromCharCode(...new Uint8Array(exportedKey)))
}