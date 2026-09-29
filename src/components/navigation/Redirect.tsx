import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export type RedirectProps = {
  url: string;
  timeout?: number;
};

export const Redirect = ({ url, timeout = 0 } : RedirectProps) => {
  const { t } = useTranslation('common');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      window.location.href = url;
    }, timeout);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [url, timeout]);
  
  return (
    <>
      { t('actions.redirecting_after') } 
      {timeout && (timeout / 1000)}s
    </>
  ); 
}; 