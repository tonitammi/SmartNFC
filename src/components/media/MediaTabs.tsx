import { useState, type SyntheticEvent } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { PUBLIC_FOLDERS } from '@src/features/storage/constants';
import type { PublicStorageFolder, StorageFileObject } from '@src/features/storage/types';
import { MediaTabContent } from './MediaTabContent';

const defaultFolders: typeof PUBLIC_FOLDERS = [
  { folder: 'audio', label: 'Audio' },
  { folder: 'image', label: 'Images' },
]; 

export interface MediaTabsProps {
  orgId: string;
  defaultFolder?: PublicStorageFolder;
  folders?: { 
    folder: PublicStorageFolder; 
    label: string; 
  }[];
  onFileSelect?: (file: StorageFileObject) => void;
};

export const MediaTabs = ({ 
  orgId, 
  defaultFolder = defaultFolders[0].folder, 
  folders = defaultFolders,
  onFileSelect,
} : MediaTabsProps) => {
  const [folder, setFolder] = useState<PublicStorageFolder>(defaultFolder);

  const handleChange = (_event: SyntheticEvent, newValue: PublicStorageFolder) => {
    setFolder(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={folder}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="Media tabs">
            { folders.map(({ folder, label }) => (
              <Tab key={`tab-key-${folder}`} label={label} value={folder} />
            )) }
          </TabList>
        </Box>
        { PUBLIC_FOLDERS.map(({ folder }) => (
          <TabPanel key={`tab-panel-key-${folder}`} value={folder}>
            <MediaTabContent 
              orgId={orgId} 
              folder={folder} 
              onSelect={onFileSelect}
            />
          </TabPanel>
        )) }
      </TabContext>
    </Box>
  );
};