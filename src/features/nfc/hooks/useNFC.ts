import type { NFCTagInfo } from '../types';
import { useState, useCallback, useRef, useEffect } from 'react';
import { getTagDetails } from '../utils';
import { useTranslation } from 'react-i18next';

export type NFCRecordType = 'url' | 'text';

export type WriteOptions = {
  makeReadonly?: boolean;
  overwrite?: boolean;
};

export const useNFC = (orgId: string) => {
  const { t } = useTranslation('components');
  const [isSupported] = useState('NDEFReader' in window);
  const [isScanning, setIsScanning] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [tagInfo, setTagInfo] = useState<NFCTagInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [writeError, setWriteError] = useState<string | null>(null);

  const ndefRef = useRef<NDEFReader | null>(null);
  const scanControllerRef = useRef<AbortController | null>(null);
  const writeControllerRef = useRef<AbortController | null>(null);

  const stopWriting = useCallback(() => {
    if (writeControllerRef.current) {
      writeControllerRef.current.abort();
      writeControllerRef.current = null;
      setIsWriting(false);
    }
  }, []);

  const stopScanning = useCallback(() => {
    if (scanControllerRef.current) {
      scanControllerRef.current.abort();
      scanControllerRef.current = null;
      setIsScanning(false);
    }
  }, []);

  const stopAll = useCallback(() => {
    stopWriting();
    stopScanning();
  }, [stopWriting, stopScanning]);

  const startScanning = useCallback(async () => {
    if (!isSupported) return setError('NFC not supported');
    
    setError(null);
    setIsScanning(true);
    scanControllerRef.current = new AbortController();

    try {
      if (!ndefRef.current) {
        ndefRef.current = new NDEFReader();
      }

      await ndefRef.current.scan({ signal: scanControllerRef.current.signal });

      ndefRef.current.onreading = (event) => {
        const decoder = new TextDecoder();
        setTagInfo(getTagDetails(event));

        event.message.records.forEach((record) => {
          try {
            const data = decoder.decode(record.data);
            setResult(data);
          } catch(err) {
            alert(`error ${(err as Error).message}`);
          }
        });
      };

      ndefRef.current.onreadingerror = () => {
        setError('Cannot read data from the NFC tag. Try another one?');
      };

    } catch (err) {
      const error = err as Error;
      if (error.name !== 'AbortError') {
        setError(error.message);
        setIsScanning(false);
      }
    }
  }, [isSupported]);

  const lockTag = useCallback(async (logger: (...params: Parameters<Console['log']>) => void = () => {}) => {
    if (!isSupported) return null;

    stopAll();

    setIsWriting(true);
    setWriteError(null);

    await new Promise(resolve => setTimeout(resolve, 150));
    writeControllerRef.current = new AbortController();

    try {
      if (!ndefRef.current) {
        ndefRef.current = new NDEFReader();
      }
      logger('start makeReadOnly');
      logger('function', ndefRef.current.makeReadOnly);

      await ndefRef.current.makeReadOnly()
      .then(() => logger('makeReadOnly.then ready'))
      .catch((err) => logger('makeReadOnly.catch', err))
      .finally(() => logger('makeReadOnly.finally'));

      logger('SUCCESS!!! Tag locked');

      return true;
    } catch (err) {
      const error = err as Error;
      logger('error', error);
      if (error.name === 'AbortError') {
        console.log('NFC operation aborted');
      } else {
        setWriteError(`Error name: ${error.name}. Error message: ${error.message}`);
      }
      return false;
    } finally {
      setIsWriting(false);
    }
  }, [isSupported, stopAll]);

  const write = useCallback(async (
    data: string, 
    { 
      makeReadonly = false, 
      overwrite = false,
    }: WriteOptions = {}
  ) => {
    if (!isSupported) return null;

    stopAll();

    setIsWriting(true);
    setWriteError(null);

    await new Promise(resolve => setTimeout(resolve, 150));
    writeControllerRef.current = new AbortController();

    try {
      if (!ndefRef.current) {
        ndefRef.current = new NDEFReader();
      }

      const details = {
        type: 'nfc',
        orgId,
        tagSerial: `tag_${Date.now()}`,
      };
      const detailParams = `?tagType=${details.type}&orgId=${details.orgId}&tagSerial=${details.tagSerial}`;
      const record: NDEFRecordInit = {
        recordType: 'url',
        data: data + detailParams,
      };

      await ndefRef.current.write(
        { records: [record] }, 
        { 
          signal: writeControllerRef.current.signal, 
          overwrite, 
        }
      );

      if (makeReadonly) {
        alert(t('nfc.readonly_info'));
        const lockController = new AbortController();
        const lockTimeoutId = setTimeout(() => lockController.abort(), 5000);

        await new Promise(resolve => setTimeout(resolve, 150));
        await ndefRef.current.makeReadOnly({ 
          signal: lockController.signal, 
        });
        clearTimeout(lockTimeoutId);

        alert('Make read only READY!');
      }

      return { record, details };
    } catch (err) {
      const error = err as Error;
      if (error.name === 'AbortError') {
        console.log('NFC operation aborted');
      } else {
        console.error('NFC IO Error Details:', error);
        setWriteError(`Error name: ${error.name}. Error message: ${error.message}`);
      }
      return null;
    } finally {
      setIsWriting(false);
    }
  }, [isSupported, orgId, stopAll, t]);

  useEffect(() => {
    return () => {
      if (scanControllerRef.current) scanControllerRef.current.abort();
      if (writeControllerRef.current) writeControllerRef.current.abort();
      stopAll();
    };
  }, [stopAll]);

  return {
    isSupported,
    isScanning,
    isWriting,
    result,
    tagInfo,
    error,
    writeError,
    startScanning,
    stopScanning,
    write,
    stopWriting,
    lockTag,
    stopAll,
  };
};