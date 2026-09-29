import { useFeedback } from '@/src/hooks/useFeedback';
import { CopyAll } from '@mui/icons-material';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Tooltip } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export type CopyInputProps = {
  value: string;
  label: string;
  dataType?: string;
  readonly?: boolean;
  successMsg?: string;
};

export const CopyInput = ({
  value,
  label,
  dataType = 'text/plain',
  readonly = true,
  successMsg,
} : CopyInputProps) => {
  const { t } = useTranslation('components');
  const { createSnackbar } = useFeedback();
  const id = useMemo(() => `copy-inp-${label}-${new Date().getTime()}`, [label]);

  const copyDataToClipboard = async () => {

    await navigator.clipboard.write([new ClipboardItem({
      [dataType]: value, 
    })]);
    
    return successMsg && createSnackbar({
      autoHideDuration: 3000,
      severity: 'success',
      content: successMsg,
    });
  };

  return (
    <FormControl variant="outlined">
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput 
        id={id}
        aria-readonly={readonly}
        label={label}
        value={value}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={t('copy_input.aria_label')}
              edge="end"
              onClick={copyDataToClipboard}
            >
              <Tooltip title={t('copy_input.tooltip')}>
                <CopyAll />
              </Tooltip>
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};