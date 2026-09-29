import { InvitationsList } from '@/src/features/organization-invitations/components/InvitationsList';
import { useSentInvitationsByOrg } from '@/src/features/organization-invitations/hooks/useSentInvitationsByOrg';
import { useOrganizationContext } from '@/src/features/organization/context/useOrganizationContext';
import { Button, Container, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export const InvitationsPage = () => {
  const { t } = useTranslation('pages');
  const { currentOrganization } = useOrganizationContext('true');
  const { data: invitations = [] } = useSentInvitationsByOrg(currentOrganization.id);
  const navigate = useNavigate();

  const navigateToCreatePage = () => {
    navigate(`/dashboard/${currentOrganization.id}/users/invite`);
  };
  
  return (
    <>
      <title>Invitations</title>
      <Container maxWidth="lg" sx={{ py: '2rem' }}>
        <Typography variant="h4" component="h2" sx={{ mb: '2rem' }}>
          {t('users.invited_users')}
        </Typography>

        <Stack 
          justifyContent="flex-end" 
          alignItems="flex-end"
          sx={{ mb: '1.5rem' }}
        >
          <Button
            variant="contained"
            onClick={navigateToCreatePage}
          >
            {t('actions.invite_user', { ns: 'common' })}
          </Button>
        </Stack>

        <InvitationsList invitations={invitations} />
      </Container>
    </>
  );
};