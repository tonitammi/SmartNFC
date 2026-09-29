import { useSearchParams } from 'react-router';
import { Container, Link, Stack, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

export const UnauthorizedPage = () => {
  const { t } = useTranslation('pages');
  const [ searchParams ] = useSearchParams();
  const sourcePath = searchParams.get('sourcePath') || '-----';

  return (
    <>
      <title>{t('errors.unauthorized.title')}</title>
      <Container sx={{ padding: '1rem', paddingTop: '3rem' }}>
        <Stack gap={2} alignItems="center">
          <Typography variant="h3" sx={{ marginBottom: '1rem' }}>
            {t('errors.unauthorized.title')}
          </Typography>
          <Typography variant="body1">
            {t('errors.unauthorized.p1', { sourcePath })}
          </Typography>
          <Typography>
            <Trans 
              ns="pages"
              i18nKey="errors.unauthorized.p2"
              components={{
                1: <Link href='/' />,
              }}
            />
          </Typography>
        </Stack>
      </Container>
    </>
  );
};