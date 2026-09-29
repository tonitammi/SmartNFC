import type { UseQueryResult } from '@tanstack/react-query';
import type { NotificationMapper } from './create-mapper';
import type { NotificationSource } from '../types';

export type CreateNotificationSourceParams<T> = {
  id: string;
  title?: string;
  queryResult: UseQueryResult<T[]>;
  mapperFunc: NotificationMapper<T>;
};

export const createNotificationSource = <T>({
  id,
  title = 'Notification',
  queryResult,
  mapperFunc,
} : CreateNotificationSourceParams<T>): NotificationSource<T> => {
  return {
    id,
    title,
    dataSource: {
      queryResult,
      mapperFunc,
    },
  };
};