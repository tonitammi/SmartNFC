import type { UseQueryResult } from '@tanstack/react-query';
import type { NotificationMapper } from './lib/create-mapper';

export type NotificationNavigationAction = {
  actionType: 'navigation';
  href: string;
};

export type NotificationFunctionAction = {
  actionType: 'function';
  func: () => void;
};

export type NotificationAction = (NotificationNavigationAction | NotificationFunctionAction) & {
  label: string;
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  action: NotificationAction;
  isSeen: boolean;
  metadata?: Record<string, unknown>;
};

export type NotificationSource<T> = {
  id: string;
  title: string;
  dataSource: {
    queryResult: UseQueryResult<T[]>;
    mapperFunc: NotificationMapper<T>;
  };
};

export type NotificationSourceStore = Record<NotificationSource['id'], NotificationSource>;