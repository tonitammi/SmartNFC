import { Alert, AlertTitle, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ZodError } from 'zod';

type ErrorType = ZodError | Error | string | unknown;

export type ErrorAlertProps = {
  error: ErrorType;
}

export const ErrorAlert = ({ error } : ErrorAlertProps) => {
  const { t } = useTranslation('common');
  
  const getErrorMessages = (err: ErrorType): string[] => {
    if (!err) return ['Undefined error'];
    if (typeof err === 'string') return [err];

    if (err instanceof ZodError && 'issues' in err) {
      return err.issues.map(({ message, path }) => `${path}: ${message}`);
    }
    
    if (typeof err === 'object' && 'message' in err) {
      return [err.message as string];
    }
    
    return [JSON.stringify(err)];
  };

  return (
    <Alert severity="error">
      <AlertTitle>{t('error')}</AlertTitle>
      {getErrorMessages(error).map((errMsg, i) => (
        <Typography key={errMsg + i} sx={{ color: 'inherit' }}>
          {errMsg}
        </Typography>
      ))}
    </Alert>
  );
};