import { useContext } from 'react';
import { AppContext, type AppContextValue } from './AppContext';

export const useAppContext = (): AppContextValue => {
  const appContext = useContext(AppContext);
  
  if (!appContext) {
    throw Error('useAppContext must be used within an FeedbackContextProvider');
  }

  return appContext;
};