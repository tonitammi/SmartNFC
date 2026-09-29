import { useOrganizationContext } from '@/src/features/organization/context/useOrganizationContext';
import { CircularProgress, List, MenuItem, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useTagContentEntries } from '@src/features/tag-manager/tag-content/hooks/useTagContentEntries';

export interface LinkedContentListProps {
  tagId: string;
};

export const LinkedContentList = ({ tagId } : LinkedContentListProps) => {
  const { t } = useTranslation('components');
  const { currentOrganization } = useOrganizationContext('true');
  const { data, isLoading } = useTagContentEntries({ 
    orgId: currentOrganization.id,
    tagId, 
  });
  const navigate = useNavigate();

  return (
    <>
      {isLoading && (
        <CircularProgress />
      )}

      {data && (
        <>
          <Typography variant="h6">
            { t('linked_content_list.info', { count: data.length }) }
          </Typography>

          <List>

            {data.map(({ content }) => (
              <Tooltip key={content.id} title="Navigate to content entry page">
                <MenuItem 
                  onClick={() => navigate(`/dashboard/${currentOrganization.id}/content/${content.id}`)}
                >
                  {content.title}
                </MenuItem>
              </Tooltip>
            ))}
          </List>
        </>
      )}
    </>
  );
};