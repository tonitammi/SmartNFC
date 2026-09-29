import { InviteUserForm } from '@/src/features/organization-invitations/components/InviteUserForm';
import { Container, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const InviteUsersPage = () => {
  const { t } = useTranslation('pages');
  return (
    <>
      <title>Invite users</title>
      <Container sx={{ py: '2rem' }}>
        <Stack gap={4} maxWidth="640px">
          <Typography variant="h5" component="h3">
            {t('users.invite_user')}
          </Typography>
          <InviteUserForm />
        </Stack>
      </Container>
    </>
  );
};