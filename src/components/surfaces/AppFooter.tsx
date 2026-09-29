// import ibsrLogo from '@src/assets/images/logos/IBSR_LOGO_Standard_2022.png';
import blackLogo from '@src/assets/images/logos/SmartAging_Logo_Black_medium.png';
import whiteLogo from '@src/assets/images/logos/SmartAging_Logo_White_medium.png';
import imgForDark from '@src/assets/images/SmartNFC-logo_for-dark.png';
import imgForLight from '@src/assets/images/SmartNFC-logo_for-light.png';

import { Box, Divider, Link, Stack, Typography, useColorScheme, useMediaQuery, useTheme } from '@mui/material';
import { useAppContext } from '@src/context/app/useAppContext';
import { useTranslation } from 'react-i18next';
import { config } from '@/src/config/config';

export const AppFooter = () => {
  const { values: { hasSidebar, sidebarWidth } } = useAppContext();
  const { t } = useTranslation('common');
  const { breakpoints } = useTheme();
  const { mode, systemMode } = useColorScheme();

  const activeMode = mode === 'system' ? systemMode : mode;
  const isMobile = useMediaQuery(breakpoints.down('md'));

  const paddingX: number = isMobile ? 8 : 16;
  const paddingLeft: number = paddingX + (hasSidebar ? sidebarWidth : 0);
  const logoWidth: number = isMobile ? 260 : 320;

  return (
    <>
      <Divider sx={{ mt: 16 }} />
      <Box 
        component="footer"
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          pt: 8,
          pb: 4, 
          pr: `${paddingX}px`,
          pl: `${paddingLeft}px`,
          maxWidth: '100%',
        }}
      >
        <Box 
          component="img"
          src={activeMode === 'dark' ? whiteLogo : blackLogo}
          alt={t('sponsors.logo_alt')}
          width={logoWidth}
        />

        <Box 
          component="img"
          src={activeMode === 'dark' ? imgForDark : imgForLight}
          alt={t('app.logo.alt')}
          width={logoWidth * 0.7}
        />

        <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={3}>
          <Link href="/terms" fontSize={isMobile ? '1rem' : '0.85rem'}>
            {t('pages.terms')}
          </Link>
          <Link href="/privacy" fontSize={isMobile ? '1rem' : '0.85rem'}>
            {t('pages.privacy')}
          </Link>
          <Link target="_blank" href={config.app.documentation} fontSize={isMobile ? '1rem' : '0.85rem'}>
            {t('pages.documentation')}
          </Link>
          <Link href="/changelog" fontSize={isMobile ? '1rem' : '0.85rem'}>
            {t('pages.changelog')}
          </Link>
        </Stack>

        <Stack alignItems="center" justifyContent="center">
          <Typography variant="body2">
            Version: {config.app.version}
          </Typography>
        </Stack>
      </Box>
    </>
  );
};