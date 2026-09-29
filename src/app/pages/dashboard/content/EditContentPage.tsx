import { useNavigate, useParams } from 'react-router';
import { useOrganizationContext } from '@/src/features/organization/context/useOrganizationContext';
import { ContentEntryForm } from '@/src/features/tag-manager/content/components/forms/ContentEntryForm';
import { useContentEntryMutations } from '@/src/features/tag-manager/content/hooks/useContentEntryMutations';
import type { ContentEntry, InsertContentEntry, UpdateContentEntry } from '@/src/features/tag-manager/content/types';
import { useContentEntry } from '@/src/features/tag-manager/content/hooks/useContentEntry';
import { Page } from '@/src/components/surfaces/Page';
import { useTranslation } from 'react-i18next';

export const EditContentPage = () => {
  const { t } = useTranslation('common');
  const { contentId = null } = useParams();
  const { currentOrganization } = useOrganizationContext('true');
  const { updateMutation } = useContentEntryMutations(currentOrganization.id);
  const { data: contentEntry, isLoading } = useContentEntry({ 
    orgId: currentOrganization.id, 
    contentId, 
  });

  const navigate = useNavigate();
  const contentUrl = `/dashboard/${currentOrganization.id}/content/${contentId}`;

  const onSave = async (data: InsertContentEntry | UpdateContentEntry | ContentEntry) => {
    if (!contentId) return;

    updateMutation.mutateAsync({ id: contentId, contentEntry: data });
    return navigate(contentUrl);
  };

  const onCancel = () => {
    navigate(contentUrl);
  };

  return (
    <Page
      title={t('pages.edit_content_entry')}
      loading={isLoading}
    >      
      {contentEntry && (
        <ContentEntryForm 
          mode="edit"
          orgId={currentOrganization.id} 
          initialData={contentEntry}
          showCancel={true}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}
    </Page>
  );
};