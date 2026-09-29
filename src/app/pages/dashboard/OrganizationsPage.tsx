import { useOrganizationContext } from '@/src/features/organization/context/useOrganizationContext';
import { Paper, Stack, Typography } from '@mui/material';
import { Navigate, useSearchParams } from 'react-router';
import { OrganizationFormDialog } from '@/src/features/organization/components/OrganizationFormDialog';
import { useOrganizationsQuery } from '@/src/features/organization/hooks/useOrganizationsQuery';
import { useAuthContext } from '@/src/features/auth/context/useAuthContext';
import { OrganizationCard } from '@/src/features/organization/components/OrganizationCard';
import { useTranslation } from 'react-i18next';
import { Page } from '@/src/components/surfaces/Page';


export const OrganizationsPage = () => {
  const [ searchParams ] = useSearchParams();
  const { t } = useTranslation('common');
  const { user } = useAuthContext();
  const { currentOrganization } = useOrganizationContext();
  const { 
    data: organizations = [], 
    isLoading, 
    error,
    refetch,
  } = useOrganizationsQuery({ userId: user?.id  });

  if (searchParams.get('auto_redirect') && currentOrganization) {
    console.log('auto redirect');
    return <Navigate to={`/admin/${currentOrganization.id}`} />;
  }

  return (
    <Page
      title={t('pages.my_organizations')}
      loading={isLoading}
      error={error}
      retry={refetch}
    >

      <Stack direction="column">
        <OrganizationFormDialog />
      </Stack>

      <Paper 
        elevation={1}
        variant="outlined" 
        sx={{ 
          my: '2rem', 
          padding: '1rem',
          pt: '2rem',
          pb: '2.5rem',
          textAlign: 'center', 
        }}
      >
        <Typography gutterBottom variant="h6">
          {t('organizations.select_organization', { ns: 'pages' })}
        </Typography>

        <Stack
          direction="row"
          flexWrap="wrap"
          gap={4}
          justifyContent="center"
          sx={{ mt: '2rem' }}
        >
          { organizations.map((org) => (
            <OrganizationCard key={org.id} organization={org} />
          ))}
        </Stack>
      </Paper>
    </Page>
  );
};