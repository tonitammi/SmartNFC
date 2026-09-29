import { createContext, type Dispatch, type SetStateAction } from 'react';

export type AppContextValue = {
  values: {
    hasSidebar: boolean;
    sidebarWidth: number;
  },
  setValues: Dispatch<SetStateAction<AppContextValue['values']>>;
};

export const AppContext = createContext<AppContextValue | null>(null);