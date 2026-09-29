import { useMemo, useState } from 'react';

type StoredValue = boolean | number | string | Record<string, unknown> | object;

export type UseStorageOptions = {
  storageType: 'local' | 'session';
  initialValue: StoredValue | null;
} 

export const useStoredState = <T>(
  key: string, 
  options: UseStorageOptions = { 
    storageType: 'local', 
    initialValue: null,
  }
): [
  value: T | null, 
  setValue: (value: StoredValue) => void,
  error: Error | null,
] => {

  const storage = useMemo(
    () => options.storageType === 'local' ? window.localStorage : window.sessionStorage, 
  [options]);

  const [ parserError, setParserError ] = useState<Error | null>(null);

  const getValueFromStorage = () => {
    const stringOrNull = storage.getItem(key);
    
    if (stringOrNull) {
      try {
        return JSON.parse(stringOrNull) as T;
      } catch(err) {
        setParserError(err as SyntaxError);
        return null;
      }
    }
    return options.initialValue as T;
  };

  const [ value, setParsedValue ] = useState<T | null>(getValueFromStorage());

  const setValueToStorageAndState = (value: StoredValue) => {
    try {
      const json = JSON.stringify(value);
      storage.setItem(key, json);
      setParsedValue(value as T);
    } catch(err) {
      setParserError(err as TypeError);
    }
  };
  
  return [
    value,
    setValueToStorageAndState,
    parserError,
  ];
};