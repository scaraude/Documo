import crypto from 'crypto'

export const generateEncryptionKey = async (): Promise<CryptoKey> => {
    return await crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256
        },
        true,
        ['encrypt', 'decrypt']
    )
}

export const encryptFile = async (file: File, key: CryptoKey): Promise<Blob> => {
    const iv = crypto.getRandomValues(new Uint8Array(12))
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

    return new Blob([encryptedArray], { type: 'application/octet-stream' })
}
