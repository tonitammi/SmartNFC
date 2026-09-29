import { createContext } from 'react';
import type { AppNotification, NotificationSource } from '../types';

export type NotificationContextValue = {
  notifications: AppNotification[];
  updateNotification: (notification: AppNotification) => void;
  removeNotification: (id: AppNotification['id']) => void;
  addNotificationSource: (notificationSource: NotificationSource<unknown>) => void;
  removeNotificationSource: (id: NotificationSource<unknown>['id']) => void;
};

export const NotificationContext = createContext<NotificationContextValue | null>(null);