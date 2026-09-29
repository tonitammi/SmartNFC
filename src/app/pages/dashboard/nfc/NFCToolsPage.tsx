import { NFCWriterDialog } from '@/src/features/nfc/components/NFCWriterDialog';
import { Box, Tab, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Page } from '@/src/components/surfaces/Page';
import { useState, type SyntheticEvent } from 'react';
import { NFCLockDialog } from '@/src/features/nfc/components/NFCLockDialog';
import { isMakeReadOnlySupported } from '@/src/features/nfc/utils';
import { useNFC } from '@/src/features/nfc/hooks/useNFC';



export const NFCToolsPage = () => {
  const { t } = useTranslation(); 
  const [tab, setTab] = useState<string>('read');
  const { isSupported } = useNFC('');
  
  const handleTabChange = (_e: SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };
  const [data] = useState<string>('');
  return (
    <Page 
      title={t('pages.nfc_tools')} 
    >
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange} aria-label="Tag tabs">
            <Tab label="Read" value="read" />
            <Tab label="Write" value="write" />
            <Tab label="Lock" value="lock" />
          </TabList>
        </Box>

        <TabPanel value="read">
          <Typography variant='h4' sx={{ mb: 1 }}>Read tag</Typography>
          <Typography sx={{mb: 1}}>
            Is supported: {isSupported ? 'Yes' : 'No' }
          </Typography>

        </TabPanel>
        <TabPanel value="write">

          <Typography variant='h4' sx={{ mb: 1 }}>Write data</Typography>
          <Typography sx={{mb: 1}}>
            Is supported: {isSupported ? 'Yes' : 'No' }
          </Typography>
          <NFCWriterDialog data={data} />
        </TabPanel>
        <TabPanel value="lock">
          <Typography variant='h4' sx={{ mb: 1 }}>Lock the tag</Typography>
          <Typography sx={{mb: 1}}>
            Is supported: {isMakeReadOnlySupported() ? 'Yes' : 'No' }
          </Typography>
          <NFCLockDialog />
        </TabPanel>
      </TabContext>

    </Page>
  );
};