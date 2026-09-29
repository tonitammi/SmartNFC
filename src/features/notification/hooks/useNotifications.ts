import type { UseQueryResult } from '@tanstack/react-query';
import type { NotificationMapper } from '../lib/create-mapper';
import type { AppNotification } from '../types';

export type UseNotificationsSourceParams<T> = {
  query: UseQueryResult<T[]>;
  mapperFunc: NotificationMapper<T>;
};

export type UseNotificationsSourceReturn = {
  notifications: AppNotification[];
}

export const useNotificationsSource = <T>({ 
  query, 
  mapperFunc, 
} : UseNotificationsSourceParams<T>): void => {
  console.log(query, mapperFunc);
  return;
};