import { Box, useColorScheme, useMediaQuery, useTheme } from '@mui/material';
// import ibsrLogo from '@src/assets/images/logos/IBSR_LOGO_Standard_2022.png';
import blackLogo from '@src/assets/images/logos/SmartAging_Logo_Black_medium.png';
import whiteLogo from '@src/assets/images/logos/SmartAging_Logo_White_medium.png';
import { useTranslation } from 'react-i18next';

export type SponsorLogosProps = {
  width?: number | string;
  mobileWidth?: number | string;
}

export const SponsorLogos = ({ width = 320, mobileWidth = 260 } :  SponsorLogosProps) => {
  const { t } = useTranslation('common');
  const { mode, systemMode } = useColorScheme();
  const { breakpoints } = useTheme();

  const activeMode = mode === 'system' ? systemMode : mode;
  const isMobile = useMediaQuery(breakpoints.down('md'));
  const logoWidth = isMobile ? mobileWidth : width;

  return (
    <>
      <Box 
        component="img"
        src={activeMode === 'dark' ? whiteLogo : blackLogo}
        alt={t('sponsors.logo_alt')}
        width={logoWidth}
      />
    </>
  );
};