import type { SmartActionContent, SmartActionFetchDetails } from '../types';
import type { ReactElement } from 'react';
import { Box, Button, Card, CardContent, type SxProps, type Theme } from '@mui/material';
import { useSmartActionHandler } from '../hooks/useSmartActionHandler';
import { ErrorAlert } from '@/src/components/feedback/ErrorAlert';

export type SmartActionRendererProps = {
  content: SmartActionContent;
  renderHeader: (label: string, description?: string) => ReactElement;
  cardVariant?: 'elevation' | 'outlined';
  cardStyles?: SxProps<Theme>;
};

export const SmartActionRenderer = ({
  content,
  renderHeader,
  cardVariant = 'outlined',
  cardStyles = {},
} : SmartActionRendererProps) => {
  const { auto_execution, label } = content;
  const {
    handler,
    data,
    isError,
    error,
    isLoading,
  } = useSmartActionHandler(content);

  if (auto_execution) handler();

  return (
    <Card variant={cardVariant} sx={cardStyles}>
      <CardContent sx={{ textAlign: 'center' }}>
        {renderHeader(label, '--- Smart Action ---')}
      </CardContent>

      {isError && (
        <ErrorAlert error={error} />
      )}

      {data && !isLoading && (

        <Box
          sx={{
            mx: '1rem',
            my: '1rem',
          }}
        >
          Response to ({(content.details as SmartActionFetchDetails).method}): {(content.details as SmartActionFetchDetails).url} 
          <pre>
            {JSON.stringify(data, null, 2)}
          </pre>
        </Box>
      )}

      {!auto_execution && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button 
            loading={isLoading}
            disabled={isLoading}
            onClick={() => handler()}
          >
            {label}
          </Button>
        </Box>
      )}
    </Card>
  );
};