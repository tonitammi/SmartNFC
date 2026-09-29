import type { OrganizationInvitation } from '../types';
import { CircularProgress, IconButton, List, ListItem, ListItemText, Stack, Tooltip } from '@mui/material';
import { useOwnInvitations } from '../hooks/useOwnInvitations';
import { ErrorAlert } from '@/src/components/feedback/ErrorAlert';
import { useTranslation } from 'react-i18next';
import { useOwnInvitationMutations } from '../hooks/useOwnInvitationMutations';
import { Check, Close } from '@mui/icons-material';
import type { User } from '@supabase/supabase-js';

type UseOwnInvitationsReturn =  ReturnType<typeof useOwnInvitations>;

export type MyInvitationsListProps = {
  invitations: UseOwnInvitationsReturn['data'];
  error: UseOwnInvitationsReturn['error'];
  isLoading: UseOwnInvitationsReturn['isLoading'];
  user: User | null;
}

export const MyInvitationsList = ({
  invitations,
  error,
  isLoading,
  user,
} : MyInvitationsListProps) => {
  const { t } = useTranslation('components');

  const { statusMutation } = useOwnInvitationMutations({
    userEmail: user?.email,
  });

  const getInvitationText = (invitation: Partial<OrganizationInvitation>) => {
    const { 
      inviter_email: email = '', 
      org_name: orgName = '',
    } = invitation;
    return t('invitations.invitation_text', { email, orgName });
  };

  const acceptInvitation = (id: string) => {
    statusMutation.mutateAsync({ id, status: 'accepted' });
  };

  const declineInvitation = (id: string) => {
    statusMutation.mutateAsync({ id, status: 'declined' });
  };

  return (
    <>
      {isLoading && (
        <Stack sx={{ py: 2 }} justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}
      
      {error && (
        <ErrorAlert error={error} />
      )}

      {invitations && (
        <List>
          {invitations.map((invitation) => (
            <ListItem 
              key={invitation.id}
              disableGutters 
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: 1,
                py: 1.5,
              }}
            >
              <ListItemText 
                primary={getInvitationText(invitation)}
                sx={{ 
                  pr: { sm: 2 },
                  mr: 0,
                  wordBreak: 'break-word',
                }}
              />

              <Stack 
                direction="row" 
                spacing={1} 
                sx={{ 
                  alignSelf: { xs: 'flex-end', sm: 'center' },
                  flexShrink: 0,
                }}
              >
                {statusMutation.isPending && (
                  <CircularProgress aria-label={t('loading', { ns: 'common' })} />
                )}
                {!statusMutation.isPending && (
                  <>
                    <Tooltip title={t('actions.accept', { ns: 'common' })}>
                      <IconButton 
                        edge="end" 
                        aria-label={t('actions.accept', { ns: 'common' })}
                        color="success"
                        onClick={() => acceptInvitation(invitation.id)}
                        disabled={statusMutation.isPending}
                      >
                        <Check />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={t('actions.decline', { ns: 'common' })}>
                      <IconButton 
                        edge="end" 
                        aria-label={t('actions.decline', { ns: 'common' })}
                        color="error"
                        onClick={() => declineInvitation(invitation.id)}
                        disabled={statusMutation.isPending}
                      >
                        <Close />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Stack>
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
};