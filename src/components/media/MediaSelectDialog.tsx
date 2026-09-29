import type { PublicStorageFolder, StorageFileObject } from '@src/features/storage/types';
import { Alert, AlertTitle, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useOrganizationContext } from '@src/features/organization/context/useOrganizationContext';
import { MediaTabs, type MediaTabsProps } from './MediaTabs';
import { useState } from 'react';
import type { PropsOf } from '@emotion/react';
import { useTranslation } from 'react-i18next';

export interface MediaSelectDialogProps extends Partial<MediaTabsProps> {
  onSelect: (file: StorageFileObject) => void; // TODO: implement select multi file
  allowMultiple?: { maxFiles: number };
  defaultFolder?: PublicStorageFolder;
  buttonProps?: Omit<PropsOf<typeof Button>, 'onClick'>;
  buttonLabel?: string;
};

export const MediaSelectDialog = ({ 
  // allowMultiple,
  defaultFolder = 'image', 
  buttonProps = {},
  buttonLabel,
  onSelect,
  ...restProps 
} : MediaSelectDialogProps) => {

  const { t } = useTranslation('components');
  const { currentOrganization } = useOrganizationContext('true');
  const [open, setOpen] = useState<boolean>(false);
  const [error ] = useState<string | null>();

  const [files, setFiles] = useState<StorageFileObject[]>([]);

  const handleClose = () => {
    setFiles([]);
    setOpen(false);
  };


  const handleFileSelect = (file: StorageFileObject) => {
    console.log('selected file', file);

    onSelect(file);
    setOpen(false);
    
    // if (!allowMultiple) {
    //   return setFiles([file]);
    // };

    // if(files.length < allowMultiple.maxFiles) {
    //   return setFiles([...files, file]);
    // };
    // return setError(`${files.length} files already selected`);
  };

  return (
    <>
      <Button
        variant="contained"
        {...buttonProps}
        onClick={() => setOpen(true)}
      >
        { buttonLabel || t('media.dialog.title') }
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t('media.dialog.title')}</DialogTitle>
        <DialogContent>
          <MediaTabs 
            {...restProps}
            orgId={currentOrganization.id} 
            defaultFolder={defaultFolder} 
            onFileSelect={handleFileSelect}
          />
          {error && (
            <Alert variant="outlined" severity="error">
              <AlertTitle>{t('error', { ns: 'common' })}</AlertTitle>
              {error}
            </Alert>
          )}
          <div>
            <Typography variant="body2">
              Selected files: {files.length}
            </Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            {t('cancel', { ns: 'common' })}
          </Button>
          
          {/* <Button 
            variant="contained" 
            disabled={!files.length} 
            onClick={handleSelect}
          >
            {t('media.select', { ns: 'common' })}
          </Button> */}
        </DialogActions>
      </Dialog>
    </>
  );
};