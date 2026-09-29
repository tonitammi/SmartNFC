import { Page } from '@/src/components/surfaces/Page';
import { useAuthContext } from '@/src/features/auth/context/useAuthContext';
import { useOrganizationContext } from '@/src/features/organization/context/useOrganizationContext';
import { useTagKeywordMutations } from '@/src/features/tag-manager/keywords/hooks/useTagKeywordMutations';
import type { Keyword } from '@/src/features/tag-manager/keywords/types';
import { TagForm } from '@/src/features/tag-manager/tags/components/TagForm';
import { useTagMutations } from '@/src/features/tag-manager/tags/hooks/useTagMutations';
import { TagSchema } from '@/src/features/tag-manager/tags/schemas';
import type { TagFormData } from '@/src/features/tag-manager/tags/types';
import { useValidator } from '@/src/hooks/useValidator';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export const CreateTagPage = () => {
  const { t } = useTranslation('common');
  const { user } = useAuthContext();
  const { currentOrganization } = useOrganizationContext('true');
  const { validate, error: validationError } = useValidator(TagSchema);
  const { insertMutation } = useTagMutations();
  const { addMutation } = useTagKeywordMutations();
  const navigate = useNavigate();

  const createTag = async (tagData: TagFormData, keywords?: Keyword[]) => {
    if (!currentOrganization || !user) return;
    if (!validate(tagData)) return;

    const createdTag = await insertMutation.mutateAsync({ tag: {
      ...tagData,
      org_id: currentOrganization.id,
      created_by: user.id,
    }});

    if (createdTag) {
      if (keywords && keywords.length > 0) {
        await addMutation.mutateAsync({ 
          tagId: createdTag.id, 
          keywords,
        });
      }
    }

    navigate(`/dashboard/${currentOrganization.id}/tags/${createdTag.id}`);
  };

  return (
    <Page
      title={t('pages.create_tag')}
    >
      <TagForm 
        error={validationError} 
        onSubmit={createTag} 
      />
    </Page>
  );
};