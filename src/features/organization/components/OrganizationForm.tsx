import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import { useState } from 'react';

import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import type { SubmitEvent } from 'react';
import type { Organization } from '../types';

export interface OrganizationFormProps {
  includeDefaultTitle?: boolean;
  mode?: 'edit' | 'create';
  organization?: Organization;
  onSubmit: (name: string, displayName?: string) => Promise<unknown>;
};

export const OrganizationForm = ({ 
  mode = 'create', 
  includeDefaultTitle = false,
  organization, 
  onSubmit, 
}: OrganizationFormProps) => {
  const { t } = useTranslation(['common', 'components']);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [name, setName] = useState<string>(organization?.name || '');
  const [displayName, setDisplayName] = useState<string>(organization?.display_name || '');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name) return;
    setLoading(true);
    await onSubmit(name, displayName || undefined);
    setLoading(false);
  };

  return (
    <Box 
      component='form' 
      noValidate 
      autoComplete='off' 
      width="100%"
      onSubmit={handleSubmit}
    >
      <Stack direction="column" gap={4}>
        { includeDefaultTitle && (
          <Typography variant='h4' align={isMobile ? 'center' : 'left'}>
            { mode === 'edit' ? 
              t('organizations.form.title_edit', { ns: 'components' }) 
              :  
              t('organizations.form.title', { ns: 'components' }) 
            }
          </Typography>
        ) }

        <TextField
          id="name-input"
          label={t('organizations.form.name_input.label', { ns: 'components' })}
          placeholder={t('organizations.form.name_input.placeholder', { ns: 'components' })}
          type="text"
          variant="outlined"
          value={name}
          disabled={loading}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          id="display-name-input"
          label={`
            ${t('organizations.form.display_name_input.label', { ns: 'components' })}
            (${t('optional', { ns: 'common' })})
          `}
          placeholder={t('organizations.form.display_name_input.placeholder', { ns: 'components' })}
          type="text"
          variant="outlined"
          value={displayName}
          disabled={loading}
          onChange={(e) => setDisplayName(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          loading={loading}
          disabled={!name}
        >
          { mode === 'edit' ? 
            t('submit_edit_btn', { ns: 'common' })
            :
            t('organizations.form.submit_btn', { ns: 'components' })
          }
        </Button>
      </Stack>
    </Box>
  );
};