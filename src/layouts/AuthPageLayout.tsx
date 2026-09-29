import Stack from '@mui/material/Stack';
import { Container, Paper, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import SensorsIcon from '@mui/icons-material/Sensors';
import { useTranslation } from 'react-i18next';

export type AuthPageLayoutProps = {
  children: ReactNode | ReactNode[] | null;
}

export const AuthPageLayout = ({ children = null } : AuthPageLayoutProps) => {  
  const { t } = useTranslation('common');

  return (
    <>
      <Container maxWidth="md">
        <Paper elevation={1}>
          <Stack 
            direction="column" 
            alignItems="center" 
            justifyContent="center"
            style={{
              width: '100%',
              maxWidth: '640px',
              position: 'relative',
              margin: '3rem auto 2rem auto',
              padding: '1rem',
            }}
          >
            <Typography 
              variant="subtitle1" 
              color="primary"
              sx={{ 
                display: 'flex', 
                gap: 1, 
                justifyContent: {
                  xs: 'center',
                  md: 'left',
                }, 
                alignItems: 'center',
                width: '100%',
                mb: '.75rem',
              }}
            >
              <SensorsIcon fontSize="inherit" />
              {t('app.name.short')}
            </Typography>

            { children }
          </Stack>
        </Paper>
      </Container>
    </>
  );
};