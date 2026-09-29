import { useState, type ReactNode } from 'react';
import { AppContext, type AppContextValue } from './AppContext';

export type AppContextProviderProps = {
  children: ReactNode | ReactNode[];
};

export const AppContextProvider = ({ children } : AppContextProviderProps) => {
  const [values, setValues] = useState<AppContextValue['values']>({
    hasSidebar: false,
    sidebarWidth: 0,
  });

  return (
    <AppContext value={{ values, setValues }}>
      { children }
    </AppContext>
  );
};