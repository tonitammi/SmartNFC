import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router';
import { AppBar, Box, Drawer, IconButton, Toolbar, Tooltip, Typography, useMediaQuery, useTheme} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DashboardSidebarContent } from '../components/navigation/DashboardSidebarContent';
import { UserMenu } from '../features/user/components/UserMenu';
import { useOrganizationContext } from '../features/organization/context/useOrganizationContext';
import BusinessIcon from '@mui/icons-material/Business';

import { LanguageToggle } from '../components/utils/LanguageToggle';
import { useAppContext } from '../context/app/useAppContext';
import { AppLogo } from '../components/utils/AppLogo';

const drawerWidth = 240;

export const DashboardLayout = () => {
  const { orgId } = useParams();
  const { pathname } = useLocation();
  const { setValues } = useAppContext();
  const { currentOrganization } = useOrganizationContext();
  const { breakpoints } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isMobile = useMediaQuery(breakpoints.down('sm'));
  const navigate = useNavigate();


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileClick = () => {
    setMobileOpen(false);
  };

  const goBack = () => {
    if (window.history?.length && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  useEffect(() => {
    if (!isMobile) {
      return setValues((values) => ({
        ...values,
        hasSidebar: true,
        sidebarWidth: drawerWidth,
      }));
    }

    setValues((values) => ({
      ...values,
      hasSidebar: false,
      sidebarWidth: 0,
    }));

    return () => {
      setValues((values) => ({
        ...values,
        hasSidebar: false,
        sidebarWidth: 0,
      }));
    };
  }, [isMobile, setValues]);
  
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton 
            color="inherit" 
            edge="start" 
            onClick={handleDrawerToggle} 
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {orgId && pathname.split('/').length > 3 && (
            <Tooltip title="Navigate to previous page">
              <IconButton 
                color="inherit" 
                onClick={goBack}
                sx={{ mr: 1 }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          )}
          
          <Typography 
            variant="h6" 
            noWrap sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              gap: 1,
              alignItems: 'center', 
            }}
          >
            {/* TODO: Logo comes to here */}
            <AppLogo />
            {/* <SensorsIcon />
            { !isMobile && `${config.app.name} ${t('pages.dashboard', { ns: 'common' })}` } */}
          </Typography>
          
          <LanguageToggle boxProps={{ sx: { mr: 1 } }} />
          <Tooltip title={currentOrganization?.name ? 'Current organization' : 'No current organization'}>
            <Typography variant="subtitle2" sx={{ display: 'flex', gap: 1 }}>
              <BusinessIcon fontSize="small" />
              {!isMobile && (currentOrganization?.name || '-')}
            </Typography>
          </Tooltip>
          
          <UserMenu />
        </Toolbar>
      </AppBar>

      <Box component="nav" 
        sx={{ 
          width: { 
            sm: drawerWidth, 
            md: drawerWidth,
          }, 
          flexShrink: { 
            sm: 0, 
            md: 0, 
          }, 
        }}
      >
        {/* Mobiili Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ 
            display: { xs: 'block', md: 'block' }, 
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }, 
            paddingTop: 120,
          }}
        >
          {/* <Toolbar />  */}
          <DashboardSidebarContent sx={{ paddingTop: 8 }} />
        </Drawer>
        
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{ 
            display: { xs: 'none', sm: 'none', md: 'block', lg: 'block' }, 
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: { 
              xs: 0,
              sm: 0,
              md: drawerWidth, 
              lg: drawerWidth, 
            } }, 
          }}
          
          open
        >
          <Toolbar /> 
          <DashboardSidebarContent onLinkClick={handleMobileClick} />
        </Drawer>
      </Box>

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 0, 
          width: { 
            xs: '100%', 
            sm: '100%',
            md: '100%',
            lg: `calc(100% - ${drawerWidth}px)`,
          },
          ml: { 
            xs: 0, 
            md: 0,
          },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};