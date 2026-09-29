import { Page } from '@/src/components/surfaces/Page';
import { useAuthContext } from '@/src/features/auth/context/useAuthContext';
import { NFCStatsChart } from '@/src/features/tag-manager/analytics/components/NFCStatsChart';
import { NFCWeekScanChart } from '@/src/features/tag-manager/analytics/components/NFCWeekScanChart';
import { Card, Stack, Typography, useMediaQuery, useTheme, type SxProps, type Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';


const cardSx: SxProps<Theme> = {
  p: 1,
  maxWidth: '100%',
  overflowX: 'auto',
};

const cardTitleSx: SxProps<Theme> = {
  mb: 1,
};

export const DashboardPage = () => {
  const { t } = useTranslation(['common', 'pages']);
  const { user } = useAuthContext();
  const { breakpoints } = useTheme();
  const isWideScreen = useMediaQuery(breakpoints.up('lg'));

  const throwError = () => {
    throw Error('Test error');
  };

  return (
    <Page
      title={t('pages.dashboard')}
    >
      <Typography variant="h5" sx={{ mt: 3 }} onClick={throwError}>
        {t('pages:dashboard.title', { userName: user?.email || 'user' })}
      </Typography>

      <Stack
        direction={isWideScreen ? 'row' : 'column'} 
        flexWrap="wrap"
        sx={{
          gap: 1,
          mt: 2,
        }}
      >
        <Card sx={cardSx}>
          <Typography variant="h5" sx={cardTitleSx}>
            {t('dashboard.top_5_scanned_tags', { ns: 'pages' })}
          </Typography>
          <NFCStatsChart />
        </Card>

        <Card sx={cardSx}>
          <Typography variant="h5" sx={cardTitleSx}>
            {t('dashboard.last_7_days_scans', { ns: 'pages' })}
          </Typography>
          <NFCWeekScanChart />
        </Card>
      </Stack>
    </Page>
  );
};