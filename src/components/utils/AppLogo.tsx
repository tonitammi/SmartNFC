
import logoForDark from '@src/assets/images/SmartNFC-logo_for-dark.png';
import logoForLight from '@src/assets/images/SmartNFC-logo_for-light.png';

import { Box, useColorScheme, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

export type AppLogoProps = {
  width?: number | string;
  mobileWidth?: number | string;
};

export const AppLogo = ({
  width = '120px',
  mobileWidth = '90px',
} : AppLogoProps) => {
  const { t } = useTranslation('common');
  const { breakpoints } = useTheme();
  const { mode, systemMode } = useColorScheme();

  const activeMode = mode === 'system' ? systemMode : mode;
  const isMobile = useMediaQuery(breakpoints.down('md'));

  return (
    <Box 
      component="img"
      src={activeMode === 'dark' ? logoForDark : logoForLight}
      alt={t('sponsors.logo_alt')}
      width={isMobile ? mobileWidth : width}
    />
  );
};
    