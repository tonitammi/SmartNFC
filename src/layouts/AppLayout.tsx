import { Outlet, useLocation, useNavigate } from 'react-router';
import { AppFooter } from '@src/components/surfaces/AppFooter';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { AppLogo } from '../components/utils/AppLogo';
import { LanguageToggle } from '../components/utils/LanguageToggle';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { AUTH_REDIRECT_KEY } from '../features/auth/constants';
import { ThemeToggle } from '../components/utils/ThemeToggle';

export const AppLayout = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const navigate = useNavigate();
  const location = useLocation();

  const toLogin = () => {
    const path = location.pathname;
    navigate(`/login?${AUTH_REDIRECT_KEY}=${path}`);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            noWrap sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              gap: 1,
              alignItems: 'center', 
            }}
          >
            <AppLogo />
          </Typography>
          
          {!isLoggedIn && (
            <Button 
              size="small"
              color="secondary"
              variant="contained"
              sx={{
                mr: 1,
              }}
              onClick={toLogin}
            >
              {t('auth.auth_form.sign_in_title', { ns: 'components' })}
            </Button>
          )}
          
          <ThemeToggle boxProps={{ sx: { mr: 1 } }} />
          <LanguageToggle boxProps={{ sx: { mr: 1 } }} />
          
        </Toolbar>
      </AppBar>

      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 0, 
          width: '100%',
          ml: { 
            xs: 0, 
            md: 0,
          },
        }}
      >
        <Toolbar />
        <Outlet />
        <AppFooter />
      </Box>
    </Box>
  );
};