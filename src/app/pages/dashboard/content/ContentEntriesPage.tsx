import { Page } from '@/src/components/surfaces/Page';
import { useOrganizationContext } from '@/src/features/organization/context/useOrganizationContext';
import { ContentList } from '@/src/features/tag-manager/content/components/ContentList';
import { useContentEntries } from '@/src/features/tag-manager/content/hooks/useContentEntries';
import { Add } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export const ContentEntriesPage = () => {
  const { t } = useTranslation('common'); 
  const { currentOrganization } = useOrganizationContext('true');
  const { data = [], isLoading, error } = useContentEntries(currentOrganization.id);
  const navigate = useNavigate();

  return (
    <Page 
      title={t('pages.content_entries')}
      loading={isLoading}
      error={error}
    >
      <Stack 
        direction="row"
        justifyContent="flex-end"
        alignItems="baseline" 
        flexWrap="wrap"
        gap={4}
        sx={{ mb: '2rem' }}
      >
        <div>
          <Button 
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate(`/dashboard/${currentOrganization.id}/content/create`)}
          >
            {t('actions.create')}
          </Button>
        </div>
      </Stack>

      <ContentList contentEntries={data} />
    </Page>
  );
}; 