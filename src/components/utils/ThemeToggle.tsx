import type { TFunction } from 'i18next';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useColorScheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Box, FormControl, IconButton, InputLabel, Menu, Tooltip } from '@mui/material';
import type { PropsOf } from '@emotion/react';
import { useState, type MouseEventHandler } from 'react';
import { Check, DarkMode } from '@mui/icons-material';

export type ThemeMode = 'system' | 'dark' | 'light';
export type ThemeToggleProps = { 
  variant?: 'icon' | 'select';
  showLabel?: boolean;
  selectProps?: PropsOf<typeof Select>; 
  boxProps?: PropsOf<typeof Box>; 
};

export const ThemeToggle = ({ 
  variant = 'icon',
  showLabel = false, 
  selectProps = {},
  boxProps = {},
}: ThemeToggleProps) => {
  const { mode, setMode } = useColorScheme();
  const { t } = useTranslation('common');

  if (!mode) return null;

  if (variant === 'icon') {
    return <IconThemeSelect 
      t={t}
      mode={mode}
      setMode={setMode}
      boxProps={boxProps}
    />;
  } 

  if (variant === 'select') {
    return <ThemeSelect 
      t={t} 
      mode={mode} 
      setMode={setMode} 
      showLabel={showLabel}
      selectProps={selectProps} 
    />;
  }
};

type SharedThemeProps = { 
  t: TFunction<'common', undefined>; 
  mode?: 'system' | 'dark' | 'light';
  setMode: (mode: ThemeMode | null) => void;
};

interface ThemeSelectProps extends SharedThemeProps { 
  showLabel?: boolean; 
  selectProps?: PropsOf<typeof Select>;
};

const ThemeSelect = ({ 
  showLabel = false, 
  selectProps = {},
  t, 
  mode, 
  setMode,
}: ThemeSelectProps) => {

  return (
    <FormControl>
      <InputLabel id="theme-toggle-label">
        { showLabel ? t('app.themes.select_label') : '' }
      </InputLabel>
      <Select
        labelId="theme-toggle-label" 
        label={showLabel ? t('app.themes.select_label') : ''}
        value={mode}
        onChange={(e) => setMode(e.target.value as ThemeMode)}
        {...selectProps}
      >
        <MenuItem value='system'>{t('app.themes.system')}</MenuItem>
        <MenuItem value='light'>{t('app.themes.light')}</MenuItem>
        <MenuItem value='dark'>{t('app.themes.dark')}</MenuItem>
      </Select>
    </FormControl>
  );
};

interface IconThemeSelectProps extends SharedThemeProps { 
  boxProps?: PropsOf<typeof Box>;
};

const IconThemeSelect = ({
  t,
  mode,
  setMode,
  boxProps = {},
} : IconThemeSelectProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = !!anchorEl;

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderIcon = (themeMode: ThemeMode) => {
    return mode === themeMode ? (
      <Check sx={{ mr: 1 }} />
    ) : (
      <Check sx={{ mr: 1, visibility: 'hidden' }} />
    );
  };
  return (
        <>
      <Box component="span" {...boxProps}>
        <Tooltip title={t('app.themes.select_label')}>
          <IconButton 
            id="theme-menu-btn"
            aria-controls={open ? 'theme-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <DarkMode />
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        id="theme-menu"
        aria-labelledby="theme-menu-btn"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          px: 4,
        }}
      >
        <MenuItem value='system' onClick={() => setMode('system')}>
          {renderIcon('system')}
          {t('app.themes.system')}
        </MenuItem>
        <MenuItem value='light' onClick={() => setMode('light')}>
          {renderIcon('light')}
          {t('app.themes.light')}
        </MenuItem>
        <MenuItem value='dark' onClick={() => setMode('dark')}>
          {renderIcon('dark')}
          {t('app.themes.dark')}
        </MenuItem>
      </Menu>
    </>
  );
};