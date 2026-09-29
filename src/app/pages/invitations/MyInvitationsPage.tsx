import { Page } from '@/src/components/surfaces/Page';
import { useAuthContext } from '@/src/features/auth/context/useAuthContext';
import { MyInvitationsList } from '@/src/features/organization-invitations/components/MyInvitationsList';
import { useOwnInvitations } from '@/src/features/organization-invitations/hooks/useOwnInvitations';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const MyInvitationsPage = () => {
  const { t } = useTranslation('common');
  const { user } = useAuthContext();
  const {
    data: invitations,
    error,
    isLoading,
  } = useOwnInvitations(user?.email, { 
    include: { 
      onlyPending: true, 
      expired: false,
    }, 
  });

  const getNotFoundText = () => {
    const target = t('invitations');
    return t('feedback.zero_found', { target });
  };

  return (
    <Page 
      title={t('pages.my_invitations')}
      loading={isLoading}
      error={error}
    >
      <Stack 
        direction="column" 
        justifyContent="center" 
        alignItems="center"
        sx={{
          maxWidth: '640px',
        }}
      >
        {!isLoading && invitations?.length === 0 && (
          <Typography variant="h5">
            {getNotFoundText()}
          </Typography>
        )}
        <MyInvitationsList 
          user={user}
          invitations={invitations}
          error={error}
          isLoading={isLoading}
        />
      </Stack>
    </Page>
  );
};