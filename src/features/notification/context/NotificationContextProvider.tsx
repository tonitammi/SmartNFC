import { useState, type ReactNode } from 'react';
import { NotificationContext } from './NotificationContext';
import type { AppNotification, NotificationSource, NotificationSourceStore } from '../types';

export type NotificationSourceProviderProps =  { 
  children: ReactNode | ReactNode[]; 
};
export const NotificationSourceProvider = ({ children } : NotificationSourceProviderProps) => {

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notificationSources, setNotificationsSources] = useState<NotificationSourceStore>({});
  
  const updateNotification = (notification: AppNotification) => {
    const index = notifications.findIndex(({ id }) => id === notification.id);
    if (index < 0) return;
    const clonedArr = structuredClone(notifications);
    clonedArr[index] = notification;
    setNotifications(clonedArr);
  };

  const removeNotification = (id: AppNotification['id']) => {
    const index = notifications.findIndex(({ id: nId }) => nId === id);
    if (index < 0) return;
    const clonedArr = structuredClone(notifications);
    clonedArr.splice(index, 1);
    setNotifications(clonedArr);
  };

  const addNotificationSource = (notificationSource: NotificationSource<unknown>) => {
    const { id: key } = notificationSource;

    if (notificationSources[key]) return;
    setNotificationsSources((sources) => sources[key] = notificationSource);
  };

  const removeNotificationSource = (id: NotificationSource<unknown>['id']) => {
    const clonedNotificationSources = structuredClone(notificationSources);
    try {
      delete clonedNotificationSources[id];
      setNotificationsSources(clonedNotificationSources);
    } catch(err) { console.log(err); }
  };

  return (
    <NotificationContext 
      value={{
        notifications,
        updateNotification,
        removeNotification,
        addNotificationSource,
        removeNotificationSource,
      }}
    >
      { children }
    </NotificationContext>
  );
};