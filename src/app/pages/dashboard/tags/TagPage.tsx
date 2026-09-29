import { useNavigate, useParams } from 'react-router';
import { useOrganizationContext } from '@/src/features/organization/context/useOrganizationContext';
import { 
  Box, 
  Button, 
  List, 
  ListItem, 
  Stack, 
  Typography, 
  useMediaQuery, 
  useTheme, 
  Tab,
  CircularProgress,
  ListItemText,
  ListItemButton,
  MenuItem,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useTagQuery } from '@/src/features/tag-manager/tags/hooks/useTagQuery';
import { useTranslation } from 'react-i18next';
import { Edit, MoreVert, Refresh } from '@mui/icons-material';
import { LinkedContentList } from '@/src/features/tag-manager/tag-content/components/LinkedContentList';
import { AssignContentDialog } from '@/src/features/tag-manager/content/components/AssignContentDialog';
import AppAccordion from '@/src/components/surfaces/AppAccordion';
import { NFCWriterDialog } from '@/src/features/nfc/components/NFCWriterDialog';
import { getTagContentURL } from '@/src/features/tag-manager/tag-content/utils';
import { SelectedKeywords } from '@/src/features/tag-manager/keywords/components/SelectedKeywords';
import { useTagKeywords } from '@/src/features/tag-manager/keywords/hooks/useTagKeywords';
import { Page } from '@/src/components/surfaces/Page';
import { useTagNfcTagMutations } from '@/src/features/tag-manager/tag-nfc-tags/hooks/useTagNfcTagMutations';
import { useState, type SyntheticEvent } from 'react';
import { useTagNfcTags } from '@/src/features/tag-manager/tag-nfc-tags/hooks/useTagNfcTags';
import SimpleMenu from '@/src/components/navigation/SimpleMenu';

export const TagPage = () => {
  const { tagId = null } = useParams();
  const { t } = useTranslation('common');
  const { currentOrganization } = useOrganizationContext('true');
  const { data: keywords = [] } = useTagKeywords(tagId);
  const {
    data: tagNfcTags, 
    isLoading: isTagNfcTagsLoading,
    isPending: isTagNfcTagsPending,
    refetch: refetchTagNfcTags,
  } = useTagNfcTags(tagId);
  const { insertMutation } = useTagNfcTagMutations();
  const { data: tag, isLoading, error } = useTagQuery({ 
    tagId, 
    orgId: currentOrganization.id,
  });

  const [tab, setTab] = useState<string>('details');
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (_e: SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const handleWriteSuccess = ({ details }: {
    record: NDEFRecordInit;
    details: {
      type: string;
      orgId: string;
      tagSerial: string;
    };
  }) => {
    if (!tagId) return;

    insertMutation.mutate({
      tag_id: tagId,
      nfc_tag_id: details.tagSerial,
      org_id: details.orgId,
    });
  };

  return (
    <Page 
      title={`Tag: ${tag?.label}`}
      loading={isLoading}
      error={error}
    >
      <Stack 
        direction="row" 
        justifyContent={isMobile ? 'flex-start' : 'flex-end'}
        gap={3}
        sx={{ mb: isMobile ? '1.5rem' : '1rem' }}
      >
        <SimpleMenu 
          useIconBtn
          buttonLabel={<MoreVert />}
        >
          <MenuItem 
            onClick={() => navigate(`/app/content/${tagId}?orgId=${currentOrganization.id}`)}
          >
            Show client view
          </MenuItem>
        </SimpleMenu>

        {tag && (
          <NFCWriterDialog 
            data={getTagContentURL(tag.id)} 
            readonlyData 
            onSuccess={handleWriteSuccess}
          />
        )}

        <Button
          variant="outlined"
          startIcon={<Edit />}
          href={`/dashboard/${currentOrganization.id}/tags/edit/${tagId}`}
        >
          {t('actions.edit')}
        </Button>
      </Stack>

      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange} aria-label="Tag tabs">
            <Tab label="Details" value="details" />
            <Tab label="Content" value="content" />
            <Tab label="Analytics" value="analytics" />
          </TabList>
        </Box>

        <TabPanel value="details">
          <Typography variant="h6" sx={{ mb: 2}}>
            Label: {tag?.label}
          </Typography>
          
          <Box sx={{mt: 2, mb: 3}}>
            <Typography variant="h6" sx={{ mb: 1 }}>Keywords</Typography>
            <SelectedKeywords values={keywords} />
          </Box>
          
          <AppAccordion title="Location details">
            <List>
              <ListItem>
                {t('tags.form.address_input.label', { ns: 'components' })}: {tag?.address}
              </ListItem>
              <ListItem>
                {t('tags.form.floor_input.label', { ns: 'components' })}: {tag?.floor}
              </ListItem>
              <ListItem>
                {t('tags.form.room_input.label', { ns: 'components' })}: {tag?.room}
              </ListItem>
            </List>
          </AppAccordion>
        </TabPanel>

        <TabPanel value="content">
          {tagId && (
            <>
              <Stack 
                direction={isMobile ? 'column' : 'row'} 
                justifyContent={isMobile ? 'flex-start' : 'flex-end'} 
                flexWrap="wrap" 
                gap={2}
                sx={{ 
                  mt: isMobile ? '1.5rem' : '.5rem',
                  mb: isMobile ? '2rem' : '1rem', 
                }}
              >
                <Button 
                  size={isMobile ? 'medium' : 'small'} 
                  variant={isMobile ? 'outlined' : 'text'}
                  href={`/dashboard/${currentOrganization.id}/content/create?tagId=${tagId}`}
                >
                  Create and assign content
                </Button>

                <AssignContentDialog 
                  tagId={tagId} 
                  buttonProps={{ 
                    variant: 'contained',
                    size: isMobile ? 'medium' : 'small',
                  }} 
                />
              </Stack>

              <LinkedContentList tagId={tagId} />
            </>
          )}
        </TabPanel>

        <TabPanel value="analytics">
          {isTagNfcTagsLoading && (
            <Stack sx={{ py: 2 }} justifyContent="center" alignItems="center">
              <CircularProgress />
            </Stack>
          )}
          {!isTagNfcTagsLoading && tagNfcTags?.length === 0 && (
            <Typography variant="body1">
              No analytic data available
            </Typography>
          )} 
          {tagNfcTags && (
            <>
              <Button
                disabled={isTagNfcTagsLoading}
                loading={isTagNfcTagsPending}
                onClick={() => refetchTagNfcTags()}
                startIcon={<Refresh />}
              >
                {t('actions.refresh')}
              </Button>
              <List sx={{ maxWidth: '640px' }}>
                {tagNfcTags.map((tagNfcTag) => (
                  <ListItem key={tagNfcTag.nfc_tag_id}>
                    <ListItemText 
                      primary={`# ${tagNfcTag.nfc_tag_id}`}
                      secondary={`Scanned: ${tagNfcTag.scan_count} times (last scan: ${new Date(tagNfcTag.last_scanned_at || 0).toLocaleString()})`}
                    />
                    <ListItemButton>

                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </TabPanel>
      </TabContext>
    </Page>
  );
};