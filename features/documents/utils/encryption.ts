const generateEncryptionKey = async (): Promise<CryptoKey> => {
  return await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
};

export const encryptFile = async (
  file: File
): Promise<{ encryptedFile: Uint8Array; encryptionKey: CryptoKey }> => {
  const key = await generateEncryptionKey();

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const fileBuffer = await file.arrayBuffer();

  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    fileBuffer
  );

  const encryptedArray = new Uint8Array(iv.length + encryptedData.byteLength);
  encryptedArray.set(iv, 0);
  encryptedArray.set(new Uint8Array(encryptedData), iv.length);

  return { encryptedFile: encryptedArray, encryptionKey: key };
};

export const exportedKeyBase64 = async (key: CryptoKey): Promise<string> => {
  const exportedKey = await window.crypto.subtle.exportKey('raw', key);
  return btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
};

export const importEncryptionKey = async (
  keyBase64: string
): Promise<CryptoKey> => {
  const keyData = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0));
  return await crypto.subtle.importKey('raw', keyData, 'AES-GCM', true, [
    'decrypt',
  ]);
};

export const decryptBlob = async (
  encryptedBlob: Blob,
  key: CryptoKey,
  mimeType: string
): Promise<Blob> => {
  const iv = encryptedBlob.slice(0, 12);
  const encryptedData = encryptedBlob.slice(12);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: await iv.arrayBuffer(),
    },
    key,
    await encryptedData.arrayBuffer()
  );

  return new Blob([decryptedBuffer], { type: mimeType });
};

export const computeFileHash = async (file: File): Promise<string> => {
  const fileBuffer = await file.arrayBuffer();
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', fileBuffer);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};
