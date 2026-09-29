import { Page } from '@/src/components/surfaces/Page';
import { useOrganizationContext } from '@/src/features/organization/context/useOrganizationContext';
import { TagList } from '@/src/features/tag-manager/tags/components/TagList';
import { useTagsQuery } from '@/src/features/tag-manager/tags/hooks/useTagsQuery';
import { Add } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export const TagsPage = () => {
  const { t } = useTranslation('common');
  const { currentOrganization } = useOrganizationContext('true');
  const { data: tags, isLoading, error } = useTagsQuery({ orgId: currentOrganization.id });
  const navigate = useNavigate();
  
  return (
    <Page
      title={t('pages.tags')}
      loading={isLoading}
      error={error}
    >
      <Stack
        direction="row"
        justifyContent="flex-end"
        sx={{ marginBottom: '2rem' }}
      >
        <div>
          <Button 
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate(`/dashboard/${currentOrganization.id}/tags/create`)}
          >
            {t('actions.create')}
          </Button>
        </div>     
      </Stack>

      {tags && <TagList tags={tags} />}
    </Page>
  );
};