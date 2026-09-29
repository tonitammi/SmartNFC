import { useOrganizationContext } from '@/src/features/organization/context/useOrganizationContext';
import { useScanWeekStats } from '../hooks/useScanWeekStats';
import { CircularProgress, Box } from '@mui/material';
import { getDayLabel } from '../utils';
import { LineChart } from '@mui/x-charts';
import { useTranslation } from 'react-i18next';

export const NFCWeekScanChart = () => {
  const { t } = useTranslation('components');
  const { currentOrganization } = useOrganizationContext('true');
  const { i18n } = useTranslation();
  const { data = [], isLoading } = useScanWeekStats(currentOrganization.id);

  const xLabels = data.map(({ day_index }) => 
    getDayLabel(day_index, { 
      language: i18n.language, 
      type: 'short',
    })
  );

  const yData = data.map(({ scan_count }) => scan_count);

  return (
    isLoading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    ) : (
      data.length > 0 && (
        <LineChart
          width={600}
          height={300}
          series={[
            { 
              data: yData, 
              label: t('analytics.scans'), 
              area: true,
              color: '#1976d2',
            },
          ]}
          xAxis={[{ 
            scaleType: 'point', 
            data: xLabels,
          }]}
          margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
        />
      )
    )
  );
};