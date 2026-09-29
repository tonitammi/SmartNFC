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
  FormControl, 
  FormControlLabel, 
  IconButton, 
  InputAdornment, 
  InputLabel, 
  OutlinedInput, 
  Stack, 
  Switch, 
  Tooltip, 
  Typography, 
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNFC } from '../hooks/useNFC';
import { useOrganizationContext } from '../../organization/context/useOrganizationContext';
import { injectTagDetails } from '../utils';
import { CopyAll, Nfc } from '@mui/icons-material';
import { useFeedback } from '@/src/hooks/useFeedback';
import { UserAgentInfo } from '@/src/components/utils/UserAgentInfo';

export interface NFCWriterDialogProps extends Omit<PropsOf<typeof Dialog>, 'open'> {
  data: string;
  readonlyData?: boolean;
  buttonProps?: Omit<PropsOf<typeof Button>, 'onClick'>;
  onSuccess?: (params: { 
    record: NDEFRecordInit, 
    details: {
      type: string;
      orgId: string;
      tagSerial: string;
    } 
  }) => void;
};

export const NFCWriterDialog = ({ 
  data, 
  readonlyData = true, 
  buttonProps = {},
  onSuccess = () => {}, 
} : NFCWriterDialogProps) => {
  const { t } = useTranslation('components');
  const { createSnackbar } = useFeedback();
  const { currentOrganization } = useOrganizationContext('true');
  const { isSupported, isWriting, writeError, write, stopWriting } = useNFC(currentOrganization.id);
  const [open, setOpen] = useState<boolean>(false);
  const [overwrite, setOverwrite] = useState<boolean>(true);
  const [makeReadonly, setMakeReadonly] = useState<boolean>(false);

  
  const recordData = useMemo(() => {
    const dataWithParams = data + '?tagSerial={{tagSerial}}&tagType={{tagType}}&orgId={{orgId}}';

    return injectTagDetails(dataWithParams, {
      valuesToInject: {
        orgId: currentOrganization.id,
        tagType: 'nfc',
        tagSerial: crypto.randomUUID(),
      },
      keysToInject: ['orgId', 'tagType', 'tagSerial'],
    });
  }, [data, currentOrganization]);

  const writeNFC = async () => {
    if (!data && isWriting) return;
    const writeResponse = await write(data, { 
      makeReadonly, 
      overwrite, 
    });

    if (writeResponse) {
      createSnackbar({
        autoHideDuration: 5000,
        severity: 'success',
        content: t('nfc.writer_dialog.write_success'),
      });
      handleClose();
      onSuccess(writeResponse);
    }
  };

  const handleClose = () => {
    stopWriting();
    setOpen(false);
  };

  const copyRecordDataToClipboard = async () => {
    const type = 'text/plain';
    const clipboardItem = new ClipboardItem({
      [type]: recordData, 
    });
    await navigator.clipboard.write([clipboardItem]);
    
    createSnackbar({
      autoHideDuration: 3000,
      severity: 'success',
      content: 'Record data copied',
    });
  };

  useEffect(() => {
    stopWriting();
  }, [stopWriting]);

  return (
    <>
      <Button 
        variant="contained" 
        onClick={() => setOpen(true)}
        startIcon={<Nfc />}
        {...buttonProps}
      >
        {t('nfc.writer_dialog.button_label')}
      </Button>

      <Dialog 
        maxWidth="sm"
        fullWidth={true}
        open={open} 
        onClose={handleClose}
      >
        <DialogTitle>
          {t('nfc.writer_dialog.dialog_title')}
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
            <Stack gap={3} sx={{ mt: '1rem' }}>
              <Typography variant="h6">
                {t('settings', { ns: 'common' })}
              </Typography>
              <FormControl variant="outlined">
                <InputLabel htmlFor="record-data-inp">Record value</InputLabel>
                <OutlinedInput id="record-data-inp" 
                  aria-readonly={readonlyData}
                  label="Record value"
                  value={recordData}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Copy input field content"
                        edge="end"
                        onClick={copyRecordDataToClipboard}
                      >
                        <Tooltip title="Copy to clipboard">
                          <CopyAll />
                        </Tooltip>
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              <FormControlLabel 
                label={t('nfc.writer_dialog.overwrite_label')}
                control={
                  <Switch 
                    defaultChecked={overwrite} 
                    checked={overwrite}
                    onChange={(e) => setOverwrite(e.target.checked)} 
                  />
                }
              />
              
              <FormControlLabel 
                label={t('nfc.writer_dialog.readonly_label')}
                control={
                  <Switch 
                    defaultChecked={makeReadonly}
                    checked={makeReadonly}
                    onChange={(e) => setMakeReadonly(e.target.checked)}
                  />
                }
              />

              {makeReadonly && (
                <Alert variant="outlined" severity="warning" sx={{ my: '1rem' }}>
                  <AlertTitle>{t('warning', { ns: 'common' })}</AlertTitle>
                  {t('nfc.writer_dialog.readonly_warning')}
                </Alert>
              )}
            </Stack>
          )}

          {isWriting && (
            <Stack 
              alignItems="center" 
              justifyContent="center" 
              gap={4} 
              sx={{ mt: '1rem' }}
            >
              <CircularProgress />
              <Typography>
                {t('nfc.writer_dialog.writing')}
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
            onClick={writeNFC} 
            disabled={isWriting || !isSupported}
          >
            {t('nfc.writer_dialog.write')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};