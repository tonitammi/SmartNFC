import type { PropsOf } from '@emotion/react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { OrganizationForm, type OrganizationFormProps } from './OrganizationForm';
import { useOrganizationMutations } from '../hooks/useOrganizationMutations';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

// import type { ReactNode } from 'react';

type DialogProps = PropsOf<typeof Dialog>;
type ButtonProps = PropsOf<typeof Button>;

export interface OrganizationFormDialogProps {
  mode?: OrganizationFormProps['mode'];
  dialogProps?: Omit<DialogProps, 'children' | 'open'>;
  buttonProps?: Omit<ButtonProps, 'children'>;
}

export const OrganizationFormDialog = ({ 
  mode = 'create',
  dialogProps = {}, 
  buttonProps = {},
} : OrganizationFormDialogProps) => {
  const { insertMutation } = useOrganizationMutations();
  const { t } = useTranslation('components');
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = async (name: string, displayName?: string) => {
    await insertMutation.mutateAsync({ 
      organization: {
        name,
        display_name: displayName,
      },
    });

    setOpen(false);
  };

  return (
    <>
    <Button 
      variant="contained" 
      sx={{ width: 'fit-content' }}
      endIcon={<GroupAddIcon />}
      onClick={() => setOpen(true)}
      {...buttonProps}
    >
      {t('organizations.create_new_dialog.create_new_btn')}
    </Button>
      <Dialog maxWidth="sm" fullWidth={true} {...dialogProps} open={open}>
        <DialogTitle>
          { mode === 'create' ? 
            t('organizations.form.title')
          : 
            ('organizations.form.title_edit')
          }
        </DialogTitle>

        <DialogContent sx={{ paddingTop: '2rem', marginTop: '1rem' }}>
          <OrganizationForm 
            mode={mode}
            includeDefaultTitle={false}
            onSubmit={handleSubmit} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            {t('cancel', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};