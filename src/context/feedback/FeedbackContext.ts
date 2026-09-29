import type { CreateSnackbarOptions, SnackbarOptions } from '@/src/components/feedback/types';
import { createContext } from 'react';

export type FeedbackContextValue = {
  snackbars: SnackbarOptions[];
  createSnackbar: (createOptions: CreateSnackbarOptions) => void;
  removeSnackbar: (id: string) => void;
};

export const FeedbackContext = createContext<FeedbackContextValue | null>(null);