import { supabase } from '@/src/lib/supabase/supabaseClient';
import { useEffect, useState } from 'react';
import type { ChangePayload, RealtimeChangeEvent } from '../types';

export const useRealtimeChannel = <T>(
  event: RealtimeChangeEvent = 'UPDATE',
  handler?: (payload: ChangePayload<T>) => void
) => {
  const [response, setResponse] = useState<T>();

  useEffect(() => {
    const channel = supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event,
        schema: 'public',
      },
      (payload) => {
        const eventPayload = payload as ChangePayload<T>;
        setResponse(eventPayload.new);
        return handler && handler(eventPayload);
      }
    )
    .subscribe();

    return () => { 
      channel.unsubscribe(); 
    };
  }, [event, handler]);

  return response;
};