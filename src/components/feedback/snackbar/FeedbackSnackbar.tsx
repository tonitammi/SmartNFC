import { Alert, Snackbar, type SnackbarCloseReason, type SxProps, type Theme } from '@mui/material';
import type { SnackbarOptions } from '../types';
import type { FeedbackContextValue } from '@/src/context/feedback/FeedbackContext';
import { useEffect, useRef } from 'react';

export interface FeedbackSnackbarProps extends SnackbarOptions {
  removeSnackbar?: FeedbackContextValue['removeSnackbar'];
  sx?: SxProps<Theme>;
};

export const FeedbackSnackbar = ({ 
  id,
  content,
  autoHideDuration = 4000,
  severity = 'info',
  variant = 'filled',
  sx = {},
  removeSnackbar,
} : FeedbackSnackbarProps) => {

  const timeoutIdRef = useRef<number | null>(null);
  
  const handleClose = (
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') return;
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    return removeSnackbar && removeSnackbar(id);
  };

  useEffect(() => {
    if (autoHideDuration <= 0) return;
    
    timeoutIdRef.current = setTimeout(() => (
      removeSnackbar && removeSnackbar(id)
    ), autoHideDuration);
    
    return () => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, [id, autoHideDuration, removeSnackbar]);

  return (
    <Snackbar 
      id={id} 
      key={id}
      open={true} 
      onClose={(_e, reason) => handleClose(reason)}
      sx={sx}
    >
      <Alert 
        severity={severity} 
        variant={variant}
        onClose={() => handleClose()}
      >
        {content}
      </Alert>
    </Snackbar>
  );
};