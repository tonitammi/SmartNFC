import type { PropsOf } from '@emotion/react';
import { 
  Alert, 
  AlertTitle, 
  Button, 
  CircularProgress, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Stack, 
  Typography, 
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNFC } from '../hooks/useNFC';
import { useOrganizationContext } from '../../organization/context/useOrganizationContext';
import { UserAgentInfo } from '@/src/components/utils/UserAgentInfo';
import { Lock } from '@mui/icons-material';

export interface NFCReadDialogProps extends Omit<PropsOf<typeof Dialog>, 'open'> {
  buttonProps?: Omit<PropsOf<typeof Button>, 'onClick'>;
  onSuccess?: () => void;
};

export const NFCReadDialog = ({ 
  buttonProps = {},
  // onSuccess = () => {}, 
} : NFCReadDialogProps) => {
  const { t } = useTranslation('components');
  const { currentOrganization } = useOrganizationContext('true');
  const { isSupported, isScanning, result, error, startScanning, stopScanning } = useNFC(currentOrganization.id);
  const [open, setOpen] = useState<boolean>(false);;

  const readNFCTag = async () => {
    if (isScanning) return;
    await startScanning();
  };

  const handleClose = () => {
    stopScanning();
    setOpen(false);
  };

  useEffect(() => {
    stopScanning();
  }, [stopScanning]);

  return (
    <>
      <Button 
        variant="contained" 
        onClick={() => setOpen(true)}
        startIcon={<Lock />}
        {...buttonProps}
      >
        {t('nfc.read_dialog.button_label')}
      </Button>

      <Dialog 
        maxWidth="sm"
        fullWidth={true}
        open={open} 
        onClose={handleClose}
      >
        <DialogTitle>
          {t('nfc.read_dialog.dialog_title')}
        </DialogTitle>
        <DialogContent>
          {!isSupported && (
            <>
              <Alert severity="warning">
                <AlertTitle>{t('nfc.not_supported')}</AlertTitle>
                {t('nfc.not_supported_info')} <br /><br />
                <UserAgentInfo />
              </Alert>
              <Alert severity="info" sx={{ mt: '1rem' }}>
                <AlertTitle>{t('hint', { ns: 'common' })}</AlertTitle>
                {t('nfc.not_supported_extra_info')}
              </Alert>
            </>

          )} 

          {error && (
            <Alert variant="outlined" severity="error">
              <AlertTitle>{t('error', { ns: 'common' })}</AlertTitle>
              {error}
            </Alert>
          )} 

          {result && result}

          {isScanning && (
            <Stack 
              alignItems="center" 
              justifyContent="center" 
              gap={4} 
              sx={{ mt: '1rem' }}
            >
              <CircularProgress />
              <Typography>
                {t('nfc.read_dialog.reading')}
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            {t('cancel', { ns: 'common' })}
          </Button>
          <Button 
            variant="contained" 
            onClick={readNFCTag} 
            disabled={isScanning || !isSupported}
          >
            {t('nfc.read_dialog.read')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};