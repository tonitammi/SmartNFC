import { Page } from '@/src/components/surfaces/Page';
import { useAuthContext } from '@/src/features/auth/context/useAuthContext';
import { useOrganizationContext } from '@/src/features/organization/context/useOrganizationContext';
import { useTagKeywords } from '@/src/features/tag-manager/keywords/hooks/useTagKeywords';
import { TagForm } from '@/src/features/tag-manager/tags/components/TagForm';
import { useTagMutations } from '@/src/features/tag-manager/tags/hooks/useTagMutations';
import { useTagQuery } from '@/src/features/tag-manager/tags/hooks/useTagQuery';
import { UpdateTagSchema } from '@/src/features/tag-manager/tags/schemas';
import type { TagFormData } from '@/src/features/tag-manager/tags/types';
import { useValidator } from '@/src/hooks/useValidator';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

export const EditTagPage = () => {
  const { t } = useTranslation('common');
  const { tagId = null } = useParams();
  const { user } = useAuthContext();
  const { currentOrganization } = useOrganizationContext('true');
  const { validate, error: validationError } = useValidator(UpdateTagSchema);
  const { data, isLoading, error } = useTagQuery({ tagId, orgId: currentOrganization.id });
  const { updateMutation } = useTagMutations();
  const { data: keywords } = useTagKeywords(tagId);

  const navigate = useNavigate();

  const updateTag = async (tagData: TagFormData) => {
    if (!currentOrganization || !user || !tagId) return;
    if (!validate(tagData)) return;

    await updateMutation.mutateAsync({ 
      tagId,
      tag: {
        ...tagData,
        org_id: currentOrganization.id,
      },
    });

    navigate(`/dashboard/${currentOrganization.id}/tags/${tagId}`);
  };

  return (
    <>
      <Page
        title={t('pages.edit_tag')}
        loading={isLoading}
        error={error}
      >
        {data && (
          <TagForm 
            mode="edit" 
            initialData={data} 
            initialKeywords={keywords}
            error={validationError}
            onSubmit={updateTag} 
          />
        )}
      </Page>
    </>
  );
};