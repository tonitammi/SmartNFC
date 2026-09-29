import { Container, Link, Stack, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

export const NotFoundPage = () => {
  const { t } = useTranslation('pages');

  return (
    <>
      <title>404</title>
      <Container sx={{ padding: '1rem', paddingTop: '3rem' }}>
        <Stack gap={4} alignItems="center">
          <Typography variant="h3">
            {t('errors.not_found.title')}
          </Typography>

          <Typography variant="body1">
            <Trans 
              ns="pages"
              i18nKey="errors.not_found.p1"
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