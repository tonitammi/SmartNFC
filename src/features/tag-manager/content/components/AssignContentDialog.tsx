import type { PropsOf } from '@emotion/react';
import { Alert, AlertTitle, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useContentEntries } from '../hooks/useContentEntries';
import { useOrganizationContext } from '@/src/features/organization/context/useOrganizationContext';
import { useTagContentMutations } from '../../tag-content/hooks/useTagContentMutations';

export interface AssignContentDialogProps {
  title?: string;
  tagId: string;
  buttonLabel?: string | ReactNode;
  buttonProps?: Omit<PropsOf<typeof Button>, 'onClick'>;
  selectProps?: Omit<PropsOf<typeof Select>, 'onChange' | 'value'>;
  actionButtonProps?: Omit<PropsOf<typeof Button>, 'onClick'>;
};

export const AssignContentDialog = ({
  title,
  tagId,
  buttonLabel,
  buttonProps = {},
  selectProps = {},
  actionButtonProps = {},
}: AssignContentDialogProps) => {
  const { t } = useTranslation('components');
  const [open, setOpen] = useState<boolean>(false);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const { currentOrganization } = useOrganizationContext('true');
  const { data: contentEntries = [] } = useContentEntries(currentOrganization.id);
  const { assignMutation } = useTagContentMutations(currentOrganization.id);  

  const handleClose = () => {
    setSelectedContentId(null);
    setOpen(false);
  };

  const handleSelect = () => {
    const contentId = selectedContentId || contentEntries[0]?.id;
    if (!contentId) return;

    assignMutation.mutateAsync({ 
      tagId, 
      contentId, 
    }).then((res) => (
      res && handleClose()
    ));
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} {...buttonProps}>
        {buttonLabel || t('assign_content_dialog.open_btn.label')}
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {title || t('assign_content_dialog.title')}
        </DialogTitle>
        <DialogContent>
          {contentEntries && (
            <FormControl>
              <InputLabel id="assign-content-select">
                {t('assign_content_dialog.select.label')}
              </InputLabel>
              <Select 
                value={selectedContentId || contentEntries[0]?.id} 
                labelId="assign-content-select"
                label={t('assign_content_dialog.select.label')}
                onChange={(e) => setSelectedContentId(e.target.value as string)}
                {...selectProps}
              >
                {contentEntries.map(({ id, title }) => (
                  <MenuItem key={id} value={id}>{title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {assignMutation.isError && (
            <Alert severity="error">
              <AlertTitle>{t('error', { ns: 'common' })}</AlertTitle>
              {assignMutation.error.message}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose} 
          >
            {t('cancel', { ns: 'common' })}
          </Button>
          <Button 
            variant="contained"
            onClick={handleSelect} 
            disabled={assignMutation.isPending}
            loading={assignMutation.isPending}
            {...actionButtonProps}
          >
            {t('assign_content_dialog.action_btn.label')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};