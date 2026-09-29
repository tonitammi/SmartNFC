import { useOrganizationContext } from '@/src/features/organization/context/useOrganizationContext';
import { useContentEntryTags } from '../hooks/useContentEntryTags';
import { CircularProgress, List, MenuItem, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export interface LinkedTagsListProps {
  contentId: string;
};

export const LinkedTagsList = ({ contentId } : LinkedTagsListProps) => {
  const { t } = useTranslation('components');
  const { currentOrganization } = useOrganizationContext('true');
  const { data: contentEntryTags, isLoading } = useContentEntryTags({ 
    orgId: currentOrganization.id,
    contentId, 
  });
  const navigate = useNavigate();

  return (
    <>
      {isLoading && (
        <CircularProgress />
      )}

      {contentEntryTags && (
        <>
          <Typography variant="h6">
            { t('linked_tags_list.info', { count: contentEntryTags.length }) }
          </Typography>

          <List>
            {contentEntryTags.map(({ tag }) => (
              <Tooltip key={tag.id} title="Navigate to tag page">
                <MenuItem 
                  onClick={() => navigate(`/dashboard/${currentOrganization.id}/tags/${tag.id}`)}
                >
                  {tag.label}
                </MenuItem>
              </Tooltip>
            ))}
          </List>
        </>
      )}
    </>
  );
};