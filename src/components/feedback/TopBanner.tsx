import type { AlertProps, SnackbarCloseReason, SnackbarProps } from '@mui/material';
import { Alert, AlertTitle, IconButton, Snackbar } from '@mui/material';
import { useState, type ReactNode, type SyntheticEvent } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

export type TopBannerProps = {
  severity?: AlertProps['severity'];
  variant?: AlertProps['variant'];
  title?: string;
  initialOpenState?: boolean;
  snackbarProps?: Omit<SnackbarProps, 'open' | 'anchorOrigin' | 'action'>;
  alertProps?: Omit<AlertProps, 'severity' | 'variant'>;
  children: ReactNode;
};

export const TopBanner = ({ 
  children, 
  title,
  initialOpenState = true,
  severity = 'info',
  variant = 'outlined',
  snackbarProps = {},
  alertProps = {},
} : TopBannerProps) => {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(initialOpenState);

  const handleClose = (
    _: SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      action={
        <IconButton
          size="small"
          aria-label={t('actions.close')}
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
      {...snackbarProps}
    >
      <Alert 
        severity={severity} 
        variant={variant}
        sx={{ 
          ...(alertProps.sx || {}), 
          bgcolor: 'background.paper', 
        }}
        {...alertProps}
      >
        {title && (
          <AlertTitle>{title}</AlertTitle>
        )}

        {children}
      </Alert>
    </Snackbar>
  );
};