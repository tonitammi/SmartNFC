import type { AppNotification } from '../types';

/**Function that takes object and maps it to AppNotification */
export type MapperFunction<T> = (data: T) => AppNotification;
/**Generated mapper function that maps object to AppNotification */
export type NotificationMapper<T> = (data: T) => AppNotification; 

export const createNotificationMapper = 
<T = unknown> (mapper: MapperFunction<T>) : NotificationMapper<T> => {
  return (data: T) => mapper(data);
};
