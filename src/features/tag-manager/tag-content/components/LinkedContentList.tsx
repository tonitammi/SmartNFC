import { useOrganizationContext } from '@/src/features/organization/context/useOrganizationContext';
import { CircularProgress, IconButton, List, ListItem, ListItemButton, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useTagContentEntries } from '../hooks/useTagContentEntries';
import { Delete } from '@mui/icons-material';
import { useTagContentMutations } from '../hooks/useTagContentMutations';
import type { PropsOf } from '@emotion/react';

export interface LinkedContentListProps {
  tagId: string;
  listProps?: PropsOf<typeof List>;
};

export const LinkedContentList = ({ tagId, listProps = {} } : LinkedContentListProps) => {
  const { t } = useTranslation('components');
  const { currentOrganization } = useOrganizationContext('true');
  const { data, isLoading } = useTagContentEntries({ 
    orgId: currentOrganization.id,
    tagId, 
  });
  const { unassignMutation } = useTagContentMutations(currentOrganization.id);
  const navigate = useNavigate();

  const unassign = async (id: string) => {
    if (!confirm('Are you sure you want to unassign this content?')) return;
    unassignMutation.mutate({ contentId: id, tagId });
  };

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

          <List sx={{ maxWidth: '640px' }} {...listProps}>
            {data.map(({ content }) => (
                <ListItem
                  key={content.id}
                  secondaryAction={
                    <Tooltip title="Unassign content entry">
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        loading={
                          unassignMutation.variables?.contentId === content.id 
                          &&
                          unassignMutation.isPending
                        }
                        onClick={() => unassign(content.id)}
                      >
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <Tooltip title="Navigate to content entry page">
                    <ListItemButton
                      onClick={() => navigate(`/dashboard/${currentOrganization.id}/content/${content.id}`)}
                    >
                      {content.title}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
            ))}
          </List>
        </>
      )}
    </>
  );
};