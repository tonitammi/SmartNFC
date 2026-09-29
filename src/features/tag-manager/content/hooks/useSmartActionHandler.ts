import { useRef, useState } from 'react';
import { fetchHandler } from '../handlers/smartActionHandler';
import type { SmartActionContent } from '../types';

export const useSmartActionHandler = <T = Record<string, unknown>>(
  smartAction: SmartActionContent
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const fetching = useRef<boolean>(false);

  const handleError = (err: unknown) => {
    setError((err as Error).message || 'Unknown error');
    setIsError(true);
  }; 

  const clearError = () => {
    setError(null);
    setIsError(false);
  };

  const handler = async () => {
    if (fetching.current) return;

    fetching.current = true;
    setAttempts((a) => a + 1);
    clearError();
    setIsLoading(true);

    const { details } = smartAction;
    
    if (details.action_name === 'fetch') {
      console.log('smartActionHandler handle fetch details', details);
      try {
        const res = await fetchHandler(details);
        console.log('smartActionHandler fetchHandler response');
  
        if (details.response_details) {
          console.log('if (details.response_details)');
          const { response_type : responseType } = details.response_details;
          console.log('responseType', responseType);
          let resData;

          if (responseType === 'json') resData = await res.json();
          if (responseType === 'text') resData = await res.text();
          if (responseType === 'blob') resData = await res.blob();
          
          setData(resData || null);

          if (!['json', 'text', 'blob'].includes(responseType)) {
            throw new Error(`Unsupported response_type: ${responseType}`);
          }
        }
        return true;
      } catch(err) {
        console.log('smartActionHandler error', err);
        handleError(err);
      } finally {
        setIsLoading(false);
        fetching.current = false;
      }
    }
  
    return null;
  };

  return {
    handler,
    retry: handler,
    attempts,
    data,
    error,
    isError,
    isLoading,
  };
};