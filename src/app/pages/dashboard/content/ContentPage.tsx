import { useOrganizationContext } from '@/src/features/organization/context/useOrganizationContext';
import { useParams } from 'react-router';
import { useContentEntry } from '@/src/features/tag-manager/content/hooks/useContentEntry';
import { Box, Button, Stack, Tab, Typography } from '@mui/material';
import { ContentDataCard } from '@/src/features/tag-manager/content/components/ContentDataCard';
import { Edit } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { LinkedTagsList } from '@/src/features/tag-manager/content/components/LinkedTagsList';
import { Page } from '@/src/components/surfaces/Page';
import { useState, type SyntheticEvent } from 'react';
import { DateFormat } from '@/src/components/utils/formatting/DateFormat';

export const ContentPage = () => {
  const { contentId = null } = useParams();
  const { t } = useTranslation('common');
  const { currentOrganization } = useOrganizationContext('true');
  const { data: contentEntry, isLoading, error } = useContentEntry({ 
    orgId: currentOrganization.id,
    contentId, 
  });
  const [tab, setTab] = useState<string>('details');

  const handleTabChange = (_e: SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };
  
  return (
    <Page 
      title={t('pages.content_entry')} 
      loading={isLoading}
      error={error}
    >
      {contentEntry && (
        <Stack gap={2}>
          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<Edit />}
              href={`/dashboard/${currentOrganization.id}/content/edit/${contentEntry.id}`}
            >
              {t('actions.edit')} 
            </Button>
          </Stack>

          <TabContext value={tab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleTabChange} aria-label="Tag tabs">
                <Tab label="Details" value="details" />
                <Tab label="Linked tags" value="tags" />
              </TabList>
            </Box>

            <TabPanel value="details">
              <Typography variant="h4" sx={{ marginBottom: '1.5rem' }}>
                Title: {contentEntry.title}
              </Typography>

              <Typography variant="body1" sx={{ marginBottom: '1.5rem' }}>
                Created at: <strong><DateFormat date={contentEntry.created_at} /></strong> |
                Status: <strong>{contentEntry.status}</strong> |
                Required role: <strong>{contentEntry.required_role}</strong> |
                Shared content: <strong>{contentEntry.is_shared ? 'Yes' : 'No'}</strong>
              </Typography>

              <Typography variant="h5" sx={{ marginBottom: '1rem' }}>
                Content
              </Typography>

              <Stack gap={4}>
                {(Array.isArray(contentEntry.content_data) ? 
                  contentEntry.content_data 
                  : 
                  [contentEntry.content_data]).map((contentData) => (
                    <ContentDataCard 
                      key={contentData.content_type + contentData.label} 
                      content={contentData} 
                    />
                  ))
                }
              </Stack>
            </TabPanel>
            <TabPanel value="tags">
              {contentId && (
                <LinkedTagsList contentId={contentId} />
              )}
            </TabPanel>
          </TabContext>
        </Stack>
      ) }
    </Page>
  );
};