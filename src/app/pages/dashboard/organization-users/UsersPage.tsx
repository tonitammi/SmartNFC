import { OrganizationUserList } from '@/src/features/organization-users/components/OrganizationUserList';
import { useOrganizationsUsersQuery } from '@/src/features/organization-users/hooks/useOrganizationUsersQuery';
import { useOrganizationContext } from '@/src/features/organization/context/useOrganizationContext';
import { Add } from '@mui/icons-material';
import { Button, CircularProgress, Container, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export const UsersPage = () => {
  const { t } = useTranslation('common');
  const { currentOrganization } = useOrganizationContext('true');
  const { data: organizationUsers, isLoading } = useOrganizationsUsersQuery(
    currentOrganization.id 
  );
  const navigate = useNavigate();

  return (
    <Container sx={{ width: '100%', py: '2rem' }}>
      <title>Organization Users</title>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="baseline" 
        flexWrap="wrap"
        gap={4}
        sx={{ marginBottom: '2rem' }}
      >
        <Typography variant="h3">Users</Typography>

        <div>
          <Button 
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate(`/dashboard/${currentOrganization.id}/users/invite`)}
          >
            {t('actions.invite')}
          </Button>
        </div>
      </Stack>
      
      
      {isLoading && <CircularProgress />}
      
      {!isLoading && organizationUsers && 
        <OrganizationUserList 
          users={organizationUsers.map((user) => (
            user.id === user.organization?.owner_id ?
              { ...user, role: 'owner' }
              :
              user
          ))} 
        /> 
      }
    </Container> 
  );
};