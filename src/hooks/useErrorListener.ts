import { useEffect, useMemo, useState } from 'react';

type ErrorListenerFunc = (error: ErrorEvent | PromiseRejectionEvent) => void;

export const useErrorListener = (errorListener?: ErrorListenerFunc) => {
  const [errorEvent, setErrorEvent] = useState<ErrorEvent | PromiseRejectionEvent | null>();
  
  const clearErrorEvent = () => setErrorEvent(null);

  const listener = useMemo<ErrorListenerFunc>(() => (
    errorListener ? errorListener : (e) => setErrorEvent(e)
  ), [errorListener]);
  
  useEffect(() => {
    window.addEventListener('unhandledrejection', listener);
    window.addEventListener('error', listener);

    return () => {
      window.removeEventListener('unhandledrejection', listener);
      window.removeEventListener('error', listener);
    };
  }, [listener]);

  return { 
    errorEvent,
    clearErrorEvent,
  };
};