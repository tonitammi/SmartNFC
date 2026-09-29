import CryptoJS from 'crypto-js';

export const encryptData = <T>(data: T, key: string): string => {
  const cipherText = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  return cipherText;
};

export const decryptData = <T>(text: string, key: string): T | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(text, key);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData ? JSON.parse(decryptedData) : null;
  } catch (_err) {
    console.log(_err);
    return null;
  }
};