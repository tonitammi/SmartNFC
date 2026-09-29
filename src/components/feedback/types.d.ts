import type { PropsOf } from '@emotion/react';
import type { Alert } from '@mui/material';
import type { ReactNode } from 'react';

export type AlertProps = PropsOf<typeof Alert>;
export type AlertSeverity = AlertProps['severity'];
export type AlertVariant = AlertProps['variant'];

export type CreateSnackbarOptions = {
  content: string | ReactNode;
  autoHideDuration?: number;
  severity?: AlertSeverity;
  variant?: AlertVariant;
};

export type SnackbarOptions = CreateSnackbarOptions & { id: string };