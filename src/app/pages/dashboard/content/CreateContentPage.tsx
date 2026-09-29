import { useNavigate } from 'react-router';
import { useOrganizationContext } from '@/src/features/organization/context/useOrganizationContext';
import { ContentEntryForm } from '@/src/features/tag-manager/content/components/forms/ContentEntryForm';
import { useContentEntryMutations } from '@/src/features/tag-manager/content/hooks/useContentEntryMutations';
import { useTagContentMutations } from '@/src/features/tag-manager/tag-content/hooks/useTagContentMutations';
import type { ContentEntry, InsertContentEntry, UpdateContentEntry } from '@/src/features/tag-manager/content/types';
import { Link, Stack, Typography } from '@mui/material';
import { useSearchParams } from 'react-router';
import { useTagQuery } from '@/src/features/tag-manager/tags/hooks/useTagQuery';
import { Page } from '@/src/components/surfaces/Page';
// import { useTranslation } from 'react-i18next';

export const CreateContentPage = () => {
  const [searchParams] = useSearchParams();
  const { currentOrganization } = useOrganizationContext('true');
  const tagId = searchParams.get('tagId');
  const formMode = tagId ? 'create-and-assign' : 'create'; 
  const navigate = useNavigate();

  const { insertMutation } = useContentEntryMutations(currentOrganization.id);
  const { createAndAssignMutation } = useTagContentMutations(currentOrganization.id);
  const { data: tag, isLoading, error } = useTagQuery({ 
    tagId, 
    orgId: currentOrganization.id,
  });

  const onSave = async (data: InsertContentEntry | UpdateContentEntry | ContentEntry) => {
    const insertData = data as InsertContentEntry;

    if (tagId) {
      await createAndAssignMutation.mutateAsync({
        tagId,
        content: insertData,
      });

      return navigate(`/dashboard/${currentOrganization.id}/tags/${tagId}`);
    }

    const contentEntry = await insertMutation.mutateAsync(insertData);
    return navigate(`/dashboard/${currentOrganization.id}/content/${contentEntry.id}`);
  };

  return (
    <Page
      title={tagId ? 'Assign content to tag' : 'Create content entry'}
      loading={isLoading}
      error={error}
      hideHeader={true}
    >
      
      <Stack gap={3} sx={{ marginBottom: '2rem' }}>
        <Typography variant="h3">
          { tagId ? 'Assign content to tag' : 'Create content entry'}
        </Typography>

        {tagId && (
          <Typography variant="body2">
            Tag: <Link href={`/dashboard/${currentOrganization.id}/tags/${tagId}`}>{tag?.label}</Link>
          </Typography>
        )}
      </Stack>

      <ContentEntryForm 
        mode={formMode}
        orgId={currentOrganization.id} 
        onSave={onSave}
        onCancel={() => console.log('canceled')}
      />
    </Page>
  );
};