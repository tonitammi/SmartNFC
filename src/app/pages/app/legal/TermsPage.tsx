import { Box, Container, Divider, Stack, Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { config } from '@/src/config/config';

export const TermsPage = () => {
  const { t } = useTranslation('pages');

  return (
    <>
      <title>{t('terms.title')}</title>

      <Container maxWidth="md" sx={{ py: '4rem' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {t('terms.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('terms.last_updated')}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Stack spacing={4}>
          <Typography variant="body1">
            {t('terms.intro')}
          </Typography>

          <Paper 
            variant="outlined" 
            sx={{ 
              p: 3, 
              bgcolor: 'info.lighter', 
              borderColor: 'info.main',
              display: 'flex',
              gap: 2,
              alignItems: 'flex-start',
            }}
          >
            <WarningAmberIcon color="info" />
            <Box>
              <Typography variant="h6" gutterBottom color="info.main" sx={{ fontWeight: 'bold' }}>
                {t('terms.prototype.title')}
              </Typography>
              <Typography variant="body2">
                {t('terms.prototype.content')}
              </Typography>
            </Box>
          </Paper>

          {/* Tietojen poistaminen */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
              {t('terms.data_loss.title')}
            </Typography>
            <Typography variant="body1">
              {t('terms.data_loss.content')}
            </Typography>
          </Box>

          {/* Vastuunrajoitus */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
              {t('terms.responsibility.title')}
            </Typography>
            <Typography variant="body1">
              {t('terms.responsibility.content')}
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ mt: 8, pt: 4, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
          <Typography variant="caption" color="text.disabled">
            {t('terms.title')} — {config.app.version} ({config.app.name})
          </Typography>
        </Box>
      </Container>
    </>
  );
};