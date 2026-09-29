import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Typography from '@mui/material/Typography';

export type ResetPasswordFormProps = {
  loading?: boolean;
  error?: string | null;
  onSubmit: (email: string) => void;
}

export const ResetPasswordForm = ({ 
  loading = false, 
  error = '',
  onSubmit, 
}: ResetPasswordFormProps) => {
  const { t } = useTranslation(['common', 'components']);
  const [email, setEmail] = useState<string>('');


  const handleSubmit = () => {
    onSubmit(email);
  };

  return (
    <Box component='form' noValidate autoComplete='off' maxWidth="640px">
      <Stack direction="column" gap={4}>
        <Typography variant='h4' align='left'>
          {
            t('auth.reset_password_form.title', { ns: 'components' }) 
          }
        </Typography>
        <TextField
          id="email-input"
          label={t('auth.common.email_input.label', { ns: 'components' })}
          placeholder={t('auth.common.email_input.placeholder', { ns: 'components' })}
          type="email"
          autoComplete="email"
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
        />


        { error && <p>{t('error', { ns: 'common' })}: {error}</p> }

        <Button 
          type="button"
          variant="contained"
          disabled={!email} 
          onClick={handleSubmit}
          loading={loading}
        >
          {
            t('auth.reset_password_form.submit_btn', { ns: 'components' })
          }
        </Button>
      </Stack>
    </Box>
  );
};