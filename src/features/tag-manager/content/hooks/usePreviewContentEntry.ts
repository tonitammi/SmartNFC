import { useEffect, useMemo, useRef, useState } from 'react';
import type { ContentEntry } from '../types';
import type { FetchStatus } from '@tanstack/react-query';

type JSONOrObject = string | object | Record<string, unknown>;
type UsePreviewContentOptions = {
  loadingTimeout?: number;
  refetchTimeout?: number;
};

const parseJSON = (json: JSONOrObject): ContentEntry[] => {
  json = typeof json === 'string' ? decodeURI(json) : json;
  const objOrObjArr = typeof json === 'string' ? JSON.parse(json) : json;
  const arr = Array.isArray(objOrObjArr) ? objOrObjArr : [objOrObjArr];
  console.log('arr', arr);
  return arr;
};

export const usePreviewContentEntry = (
  jsonOrObj: JSONOrObject,
  {
    loadingTimeout = 0,
    refetchTimeout = 1000,
  } : UsePreviewContentOptions = {}
) => {
  const data = useMemo(() => parseJSON(jsonOrObj), [jsonOrObj]);
  const [isLoading, setIsLoading] = useState<boolean>(loadingTimeout === 0 ? false : true);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>(loadingTimeout === 0 ? 'idle' : 'fetching');
  const isRefetching = useRef<boolean>(false);
  const refetchTimeoutId = useRef<number>(0);


  const refetch = () => {
    if (isRefetching.current) return;
    isRefetching.current = true;
    setIsLoading(true);


    refetchTimeoutId.current = setTimeout(() => {
      isRefetching.current = true;
      setIsLoading(true);
    }, refetchTimeout);
  };

  useEffect(() => {
    if (loadingTimeout === 0) return;

    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      setFetchStatus('idle');
    }, loadingTimeout);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loadingTimeout]);

  return {
    data,
    isLoading,
    isError: false,
    error: null,
    fetchStatus,
    refetch,
  };
};