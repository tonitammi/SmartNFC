import type { PropsOf } from '@emotion/react';
import { Alert, AlertTitle, Button, CircularProgress, Container, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export interface PageProps extends Omit<PropsOf<typeof Container>, 'title'> {
  title?: string;
  titleProps?: PropsOf<typeof Typography>;
  loading?: boolean;
  loadingText?: string;
  error?: Error | string | null;
  retry?: () => void | Promise<unknown>;
  hideHeader?: boolean;
  children: ReactNode | ReactNode[];
};

export const Page = ({ 
  title = '', 
  titleProps = {}, 
  loading = false,
  loadingText = '',
  error = null,
  hideHeader = false,
  retry,
  children, 
  ...containerProps 
} : PageProps) => {
  const { t } = useTranslation('common');

  const getErrorMsg = (err: NonNullable<PageProps['error']>) => {
    if (typeof err === 'string') return err;
    if ('message' in err) return err.message;
    return JSON.stringify(err);
  }; 

  const getErrorAction = (err: PageProps['error']) => {
    if (err) {
      if (retry) {
        return {
          action: (
            <Button onClick={retry} color="error">
              {t('actions.retry')}
            </Button>
          ),        
        };
      }
      return {};
    }
    return {};
  };

  return (
    <>
      <title>{title}</title>
      <Container maxWidth="lg" sx={{ py: 2 }} {...containerProps}>
        {!hideHeader && (
          <Typography variant='h3' sx={{ mb: '2rem' }} {...titleProps}>
            {title}
          </Typography>
        )}

        { loading && (
          <Stack alignItems="center" justifyContent="center" sx={{ py: '4rem' }}>
            <Stack direction="row" gap={3}>
              <CircularProgress />
              { loadingText && (
                <Typography variant="body1">
                  {loadingText}
                </Typography>
              ) }
            </Stack>
          </Stack>
        )}
        
        { error && (
          <Alert 
            severity="error" 
            variant="outlined" 
            sx={{ my: 4 }}
            {...getErrorAction(error)}
          >
            <AlertTitle>{t('error')}</AlertTitle>
            { getErrorMsg(error) }
          </Alert>
        ) }

        { !loading && children }
        
      </Container>
    </>
  );
};