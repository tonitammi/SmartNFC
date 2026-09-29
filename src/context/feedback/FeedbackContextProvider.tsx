import { useCallback, useState, type ReactNode } from 'react';
import { FeedbackContext } from './FeedbackContext';
import type { CreateSnackbarOptions, SnackbarOptions } from '@/src/components/feedback/types';

export type FeedbackContextProviderProps = {
  children: ReactNode | ReactNode[];
};

export const FeedbackContextProvider = ({ children } : FeedbackContextProviderProps) => {
  const [snackbars, setSnackbars] = useState<SnackbarOptions[]>([]);

  const createSnackbar = useCallback((createOpts: CreateSnackbarOptions) => {
    setSnackbars((prev) => (
      [
        ...prev, 
        {
          ...createOpts, 
          id: crypto.randomUUID(),
        },
      ]
    ));
  }, []);

  const removeSnackbar = useCallback((id: string) => {
    const clonedArr = structuredClone(snackbars);
    const index = clonedArr.findIndex(x => x.id === id);
    if (index < 0) {
      return console.warn(`removeSnackbar: Snackbar with id: ${id} not found`); 
    };
    clonedArr.splice(index, 1);
    setSnackbars(clonedArr);
  }, [snackbars]);

  return (
    <FeedbackContext value={{ snackbars, createSnackbar, removeSnackbar }}>
      { children }
    </FeedbackContext>
  );
};