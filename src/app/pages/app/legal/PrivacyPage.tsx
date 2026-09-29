import { config } from '@/src/config/config';
import { Box, Container, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const PrivacyPage = () => {
  const { t } = useTranslation('pages');

  return (
    <>
      <title>{t('privacy.title')}</title>

      <Container maxWidth="md" sx={{ py: '4rem' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {t('privacy.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('privacy.last_updated')}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Stack spacing={4}>
          <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
            {t('privacy.intro')}
          </Typography>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
              {t('privacy.data_collected.title')}
            </Typography>
            <Typography variant="body1">
              {t('privacy.data_collected.content')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
              {t('privacy.purpose.title')}
            </Typography>
            <Typography variant="body1">
              {t('privacy.purpose.content')}
            </Typography>
          </Box>

          {/* Tietojen luovutus */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
              {t('privacy.sharing.title')}
            </Typography>
            <Typography variant="body1">
              {t('privacy.sharing.content')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
              {t('privacy.storage.title')}
            </Typography>
            <Typography variant="body1" sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1, borderLeft: '4px solid', borderColor: 'warning.main' }}>
              {t('privacy.storage.content')}
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ mt: 8, pt: 4, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.disabled">
            © {new Date().getFullYear()} - {config.app.name} Privacy Policy
          </Typography>
        </Box>
      </Container>
    </>
  );
};