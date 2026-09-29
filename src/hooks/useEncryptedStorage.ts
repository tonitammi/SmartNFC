import { useState, useEffect, useRef } from 'react';
import { encryptData, decryptData } from '@/src/utils/encryption';

export function useEncryptedStorage<T>(
  userId: string | undefined | null, 
  key: string, 
  initialValue: T
) {
  const storageKey = userId ? `app_${key}_${userId}` : null;
  const lastUserId = useRef(userId);

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined' || !storageKey || !userId) {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(storageKey);
      if (item) {
        const decrypted = decryptData(item, userId);

        return (decrypted !== null && decrypted !== undefined) 
          ? (decrypted as T) 
          : initialValue;
      }
    } catch (error) {
      console.error('Virhe ladattaessa localStoragesta', error);
    }
    
    return initialValue;
  });

  useEffect(() => {
    // Jos userId muuttuu (esim. logout/login), päivitetään tila
    if (userId !== lastUserId.current) {
      lastUserId.current = userId;
      
      if (!storageKey || !userId) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStoredValue(initialValue);
        return;
      }

      const item = window.localStorage.getItem(storageKey);
      const decrypted = item ? decryptData<T>(item, userId) : null;
      setStoredValue(decrypted !== null ? decrypted : initialValue);
    }
  }, [userId, storageKey, initialValue]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (storageKey && userId) {
        const encrypted = encryptData(valueToStore, userId);
        window.localStorage.setItem(storageKey, encrypted);
      }
    } catch (error) {
      console.error('Virhe tallennettaessa localStorageen', error);
    }
  };

  return [storedValue, setValue] as const;
}