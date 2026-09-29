import { Page } from '@/src/components/surfaces/Page';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { useRealtimeChannel } from '@/src/features/realtime/hooks/useRealtimeChannel';
import { createNFCScanLogEntry } from '@/src/features/tag-manager/analytics/queries/mutationQueries';
import { isLoggedScan, saveLogScanEvent } from '@/src/features/tag-manager/analytics/utils';
import { ContentEntryBlock } from '@/src/features/tag-manager/content/components/ContentEntryBlock';
import type { ContentEntry } from '@/src/features/tag-manager/content/types';
import { useTagContentEntries } from '@/src/features/tag-manager/tag-content/hooks/useTagContentEntries';
import { Info } from '@mui/icons-material';
import { 
  Button,
  IconButton, 
  Stack, 
  Tooltip, 
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router';

export const TagContentPage = () => {
 const { tagId = null } = useParams();
  const [searchParams] = useSearchParams();  
  const orgId = searchParams.get('orgId');
  const tagType = searchParams.get('tagType') || 'nfc';
  const nfcOrQrTagId = searchParams.get('tagSerial');

  const { t } = useTranslation('common');
  const { getUser } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const {
    data = [],
    isLoading: isContentLoading,
    error,
    refetch,
  } = useTagContentEntries({ tagId, orgId });

  // 1. Tallennetaan tilana VAIN reaaliaikaiset muutokset / ylikirjoitukset (tai tyhjä olio)
  const [realtimeUpdates, setRealtimeUpdates] = useState<Record<string, ContentEntry>>({});

  // 2. Lasketan lopullinen tagContent suoraan renderöinnin aikana
  // Yhdistetään haettu data ja reaaliaikaiset päivitykset ilman useEffectiä
  const tagContent = data.map((item) => {
    const updatedContent = realtimeUpdates[item.content.id];
    return updatedContent ? { ...item, content: updatedContent } : item;
  });

  // 3. Reaaliaikakuuntelija päivittää vain realtimeUpdates-tilaa
  useRealtimeChannel<ContentEntry>('UPDATE', (payload) => {
    setRealtimeUpdates((prev) => ({
      ...prev,
      [payload.new.id]: payload.new,
    }));
  });

  useEffect(() => {
    if (tagType !== 'nfc') return;
    if (!orgId || !nfcOrQrTagId || !tagId) return;
    
    getUser().then((user) => setIsAuthenticated(!!user));

    const logId = tagId + nfcOrQrTagId;
    if (isLoggedScan(logId)) return;
    
    createNFCScanLogEntry({ orgId, nfcTagId: nfcOrQrTagId })
      .then(() => saveLogScanEvent(logId));
    
  }, [nfcOrQrTagId, orgId, tagType, tagId, getUser]);

  return (
    <Page 
      maxWidth="md" 
      title="Content"
      hideHeader={true}
      loading={isContentLoading}
      error={error}
      retry={refetch}
    >

      {!isContentLoading && tagContent.length === 0 && (
        <Stack 
          gap={2} 
          justifyContent="center" 
          alignItems="center"
          direction="column"
        >
          <Typography variant="h3">
            {t('content.no_content_title', { ns: 'pages' })}
          </Typography>
          <Typography variant="body1" align="center">
            {t('content.no_content', { ns: 'pages' })}

            {!isAuthenticated && (
              <Tooltip title={t('content.no_content_hint', { ns: 'pages' })}>
                <IconButton aria-label='hint'>
                  <Info />
                </IconButton>
              </Tooltip>
            )}

            <Button onClick={() => refetch()}>
              {t('actions.retry', { ns: 'common' })}
            </Button>
          </Typography>
        </Stack>
      )}

      {tagContent.map(({ content }) => (
        <ContentEntryBlock content={content} key={content?.id} />
      ))}
      
    </Page>
  );
};
