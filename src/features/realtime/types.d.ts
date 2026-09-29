
export type RealtimeChangeEvent = '*' | 'UPDATE' | 'INSERT' | 'DELETE';

export type ChangePayload<T> = {  
  commit_timestamp: string;
  errors: null | unknown;
  eventType: RealtimeChangeEvent;
  new: T;
  old: {
    id: string;
  };
  schema: 'public' & string;
  table: string;
};