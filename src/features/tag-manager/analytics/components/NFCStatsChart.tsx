import { useOrganizationContext } from '@/src/features/organization/context/useOrganizationContext';
import { useNFCStats } from '../hooks/useNFCStats';
import { PieChart } from '@mui/x-charts/PieChart';
import { CircularProgress } from '@mui/material';

export type NFCDetailsProps = {
  limit?: number;
  width?: number;
  height?: number;
}

export const NFCStatsChart = ({ 
  limit = 5,
  width = 200,
  height = width,
} : NFCDetailsProps) => {
  const { currentOrganization } = useOrganizationContext('true');
  const { data, isLoading } = useNFCStats({ 
    orgId: currentOrganization.id, 
    limit,
  });

  const seriesData = data?.map(({ scan_count, tag_label }) => ({
    value: scan_count,
    label: `${tag_label} (${scan_count})`,
  })) || [];

  return (
  isLoading ? 
    <CircularProgress />
    : (
      <PieChart 
        width={width}
        height={height}
        series={[
          { data: seriesData },
        ]}
      />
    )
  );
};