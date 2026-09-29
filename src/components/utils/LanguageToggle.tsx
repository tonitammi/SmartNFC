import type { MouseEventHandler } from 'react';
import type { PropsOf } from '@emotion/react';
import type { i18n, TFunction } from 'i18next';
import { languageLabels } from '@/src/lib/i18n/languages';
import { Check, Language } from '@mui/icons-material';
import { Box, FormControl, IconButton, InputLabel, Menu, Select, Tooltip } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export type LanguageToggleProps = {
  variant?: 'icon' | 'select';
  boxProps?: PropsOf<typeof Box>; 
  selectProps?: PropsOf<typeof Select>;
};

export const LanguageToggle = ({ 
  variant = 'icon', 
  boxProps = {}, 
  selectProps = {}, 
} :  LanguageToggleProps) => {
  const { i18n, t } = useTranslation();

  if (variant === 'icon') {
    return <IconLanguageSelect 
      i18n={i18n} 
      t={t} 
      {...boxProps} 
    />;
  };

  if (variant === 'select') {
    return <LanguageSelect
      i18n={i18n} 
      t={t} 
      {...selectProps} 
    />;
  }
};

type SharedToggleProps = { 
  i18n: i18n; 
  t: TFunction<'common', undefined>; 
};

type IconLanguageSelectProps = SharedToggleProps & LanguageToggleProps['boxProps'];

const IconLanguageSelect = ({ 
  i18n, 
  t, 
  ...restProps 
}: IconLanguageSelectProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = !!anchorEl;

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (lang: keyof typeof languageLabels) => {
    i18n.changeLanguage(lang);
  };

  const renderIcon = (langKey: keyof typeof languageLabels) => {
    return i18n.language === langKey ? (
      <Check sx={{ mr: 1 }} />
    ) : (
      <Check sx={{ mr: 1, visibility: 'hidden' }} />
    );
  };

  return (
    <>
      <Box component="span" sx={{ width: 'unset' }} {...restProps}>
        <Tooltip title={t('actions.select_lang')}>
          <IconButton 
            id="lang-menu-btn"
            aria-controls={open ? 'lang-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <Language />
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        id="lang-menu"
        aria-labelledby="lang-menu-btn"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          px: 4,
        }}
      >
        {Object.keys(languageLabels).map((langKey, i) => (
          <MenuItem 
            key={langKey + i} 
            onClick={() => handleLanguageSelect(langKey)}
            color={langKey === i18n.language ? 'primary' : ''}
          >
            {renderIcon(langKey)}
            {languageLabels[langKey].label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

type SelectLanguageSelectProps = SharedToggleProps & LanguageToggleProps['selectProps'];

const LanguageSelect = ({ 
  i18n, 
  t, 
  ...restProps 
}: SelectLanguageSelectProps) => {


  return (
    <FormControl>
      <InputLabel id="select-lang-select-label">{t('actions.select_lang')}</InputLabel>
      <Select 
        labelId="select-lang-select-label"
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value as string)}
        {...restProps}
      >
        { Object.keys(languageLabels).map((langKey) => 
          <MenuItem value={langKey} key={langKey}>
            {languageLabels[langKey].label}
          </MenuItem>
        ) }
      </Select>
    </FormControl>
  );
};