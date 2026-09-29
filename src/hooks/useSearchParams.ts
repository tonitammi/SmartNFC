import { useEffect, useMemo, useState } from 'react';

function useSearchParams(keys: string): string | null;
function useSearchParams(keys: string[]): {key: string, value: string | null}[]; 
function useSearchParams(keys: string | string[]){
  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);
  
  const [ value, setValue ] = useState<string | null>(
    typeof keys === 'string' ? urlParams.get(keys) : null
  );
  const [ values, setValues ] = useState<{key: string, value: string | null}[] | null>(
    Array.isArray(keys) ? keys.map((key) => { 
      return { value: urlParams.get(key), key }; 
    }) : null
  );
  
  useEffect(() => {
    const handlePopStateChange = () => {
      const singleValue = typeof keys === 'string' ? urlParams.get(keys) : null;
      const multipleValues = Array.isArray(keys) ? keys.map((key) => { 
        return { value: urlParams.get(key), key }; 
      }) : null;

      setValue(singleValue);
      setValues(multipleValues);
    };

    window.addEventListener('popstate', handlePopStateChange);

    return () => window.removeEventListener('popstate', handlePopStateChange);
  }, [keys, urlParams]);

  return Array.isArray(keys) ? values : value;
};

export { useSearchParams };