import type { StorageFileObject } from '@/src/features/storage/types';
import type { PropsOf } from '@emotion/react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { CopyInput } from '../utils/CopyInput';
import { JSONTable } from '../utils/formatting/JSONTable';

export type MediaDetailsDialogProps = {
  icon: ReactNode;
  file: StorageFileObject;
  iconBtnProps?: Omit<PropsOf<typeof IconButton>, 'onClick'>;
  tooltipTitle?: string;
}

export const MediaDetailsDialog = ({ 
  file,
  icon, 
  iconBtnProps = {},
  tooltipTitle,
} : MediaDetailsDialogProps) => {
  const { t } = useTranslation('components');
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };

  const toMegaBytes = (bytes: number | string) => {
    return (parseInt('' + bytes) / 1_000_000).toFixed(2);
  };

  return (
    <>
      <Tooltip title={tooltipTitle || t('media.details', { ns: 'common' })}>
        <IconButton {...iconBtnProps} onClick={() => setOpen(true)}>
          {icon}
        </IconButton>
      </Tooltip>
      
      <Dialog 
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{t('media.details_dialog.title')}</DialogTitle>
        <DialogContent>
          <Stack gap={2}>

            <Typography>
              {file.name} ({toMegaBytes(file.metadata.size)} MB)
            </Typography>
            
            <CopyInput 
              value={file.publicUrl} 
              label="File URL"
              successMsg="File URL copied to clipboard" 
            />
            <JSONTable data={file.metadata} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            {t('actions.close', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};