import { useState } from 'react';
import { 
  Box, 
  IconButton, 
  Typography, 
  Menu, 
  MenuItem, 
  Avatar, 
  ListItemIcon, 
  Divider, 
  Tooltip,
  useColorScheme,
  ListItemText,
  Badge,
} from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import BusinessIcon from '@mui/icons-material/Business';
import { useNavigate } from 'react-router';
import { useAuthContext } from '@/src/features/auth/context/useAuthContext';
import { useTranslation } from 'react-i18next';
import { Book, Mail } from '@mui/icons-material';
import { config } from '@/src/config/config';
import { useOwnInvitationsCount } from '../../organization-invitations/hooks/useOwnInvitationsCount';

export const UserMenu = () => {
  const { t } = useTranslation('common');
  const { user, logout } = useAuthContext();
  const { data: count } = useOwnInvitationsCount(user?.email);
  const { mode, setMode } = useColorScheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = !!anchorEl;

  
  const themeCycle: Record<NonNullable<typeof mode>, NonNullable<typeof mode>> = {
    light: 'dark',
    dark: 'system',
    system: 'light',
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCycleTheme = () => {
    return !mode ? setMode('light') : setMode(themeCycle[mode]);
  };

  const getNextTheme = (themeMode: typeof mode): typeof mode => {
    if (!themeMode) return 'light';
    return themeCycle[themeMode];
  };

  if (!user) return null;

  const initial = user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Tooltip title="Account settings">
        <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
          <Badge 
            variant="dot" 
            color="error"
            invisible={!count || count <= 0} 
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {initial}
            </Avatar>
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: { mt: 1.5, minWidth: 200, overflow: 'visible' },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" noWrap fontWeight="bold">
            {t('logged_in')}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {user.email}
          </Typography>
        </Box>
        
        <Divider />

        <MenuItem onClick={() => navigate('/dashboard')}>
          <ListItemIcon>
            <BusinessIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Change organization" />
        </MenuItem>

        <MenuItem onClick={() => navigate('/dashboard/my-invitations')}>
          <ListItemIcon>
            <Mail fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('pages.my_invitations')} />
          {count && count > 0 && (
            <Badge 
              badgeContent={count} 
              color="error" 
              sx={{ ml: 2 }} 
            />
          )}
        </MenuItem>

        <MenuItem onClick={() => window.open(config.app.documentation, '_blank')}>
          <ListItemIcon>
            <Book fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('pages.documentation')} />
        </MenuItem>

        <Divider />

        <MenuItem onClick={(e) => {
          e.stopPropagation(); // Estää menun sulkeutumisen heti
          handleCycleTheme();
        }}>
          <ListItemIcon>
            {mode === 'light' && <LightModeIcon fontSize="small" />}
            {mode === 'dark' && <DarkModeIcon fontSize="small" />}
            {mode === 'system' && <SettingsBrightnessIcon fontSize="small" />}
          </ListItemIcon>

          <Tooltip title={`${t('next')} ${t('theme').toLowerCase()} ${getNextTheme(mode)}`}>
            <ListItemText 
              primary={t('theme')}
              secondary={
                mode === 'system' ? t('app.themes.system') 
                : 
                mode === 'dark' ? t('app.themes.dark') : t('app.themes.light')
              } 
            />
          </Tooltip>
        </MenuItem>

        <MenuItem onClick={() => navigate('/dashboard/settings/user')}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('settings')} />
        </MenuItem>

        <Divider />

        <MenuItem onClick={logout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Logout fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary={t('log_out')} />
        </MenuItem>
      </Menu>
    </Box>
  );
};