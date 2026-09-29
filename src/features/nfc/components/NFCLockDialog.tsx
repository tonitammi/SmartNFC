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
import { useFeedback } from '@/src/hooks/useFeedback';
import { UserAgentInfo } from '@/src/components/utils/UserAgentInfo';
import { Lock } from '@mui/icons-material';

export interface NFCLockDialogProps extends Omit<PropsOf<typeof Dialog>, 'open'> {
  buttonProps?: Omit<PropsOf<typeof Button>, 'onClick'>;
  onSuccess?: () => void;
};

export const NFCLockDialog = ({ 
  buttonProps = {},
  onSuccess = () => {}, 
} : NFCLockDialogProps) => {
  const { t } = useTranslation('components');
  const { createSnackbar } = useFeedback();
  const { currentOrganization } = useOrganizationContext('true');
  const { isSupported, isWriting, writeError, lockTag, stopWriting } = useNFC(currentOrganization.id);
  const [open, setOpen] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);

  const logger = (...params: Parameters<Console['log']>) => {
    const logs: string[] = params.map((param) => {
        if (param === null) return 'null';
        if (param === undefined) return 'undefined';

        if (typeof param === 'object') {
        try {
            if (param instanceof Error) {
            return `${param.name}: ${param.message}\n${param.stack || ''}`;
            }
            return JSON.stringify(param, null, 2);
        } catch (err) {
            console.error(err);
            return '[Monimutkainen tai pyöreä rakenne (Circular structure)]';
        }
        }
        return String(param);
    });

    setLogs((prevLogs) => [...prevLogs, ...logs]);
  };

  const lockNFCTag = async () => {
    if (isWriting) return;
    const lockResponse = await lockTag(logger);

    if (lockResponse) {
      createSnackbar({
        autoHideDuration: 5000,
        severity: 'success',
        content: t('nfc.writer_dialog.write_success'),
      });
      handleClose();
      onSuccess();
    }
  };

  const handleClose = () => {
    stopWriting();
    setOpen(false);
  };

  useEffect(() => {
    stopWriting();
  }, [stopWriting]);

  return (
    <>
      <Button 
        variant="contained" 
        onClick={() => setOpen(true)}
        startIcon={<Lock />}
        {...buttonProps}
      >
        {t('nfc.lock_dialog.button_label')}
      </Button>

      <Dialog 
        maxWidth="sm"
        fullWidth={true}
        open={open} 
        onClose={handleClose}
      >
        <DialogTitle>
          {t('nfc.lock_dialog.dialog_title')}
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

          {writeError && (
            <Alert variant="outlined" severity="error">
              <AlertTitle>{t('error', { ns: 'common' })}</AlertTitle>
              {writeError}
            </Alert>
          )} 

          {!isWriting && (
            <Alert variant="outlined" severity="warning">
              {t('nfc.lock_dialog.readonly_warning')}
            </Alert>
          )}

          <Stack direction="row">
            <Typography variant="h6">Logs:</Typography>
            <Button onClick={() => setLogs([])}>Clear</Button>
          </Stack>
          <ul>
            {logs.map((log) => (<li>{log}</li>))}
          </ul>

          {isWriting && (
            <Stack 
              alignItems="center" 
              justifyContent="center" 
              gap={4} 
              sx={{ mt: '1rem' }}
            >
              <CircularProgress />
              <Typography>
                {t('nfc.lock_dialog.locking')}
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
            onClick={lockNFCTag} 
            disabled={isWriting || !isSupported}
          >
            {t('nfc.lock_dialog.lock')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};