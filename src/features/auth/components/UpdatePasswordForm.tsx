import { Box, Button, Stack, TextField, type SxProps, type Theme } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { ErrorAlert } from '@/src/components/feedback/ErrorAlert';

export type UpdatePasswordFormProps = {
  formSx?: SxProps<Theme>;
};

export const UpdatePasswordForm = ({ formSx = {} } : UpdatePasswordFormProps) => {
  const { t } = useTranslation('components');
  const { updateUser } = useAuth();
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown | null>(null);

  const changePassword = async () => {
    setLoading(true);
    setError(null);

    try {
      if (password !== passwordConfirm) {
        throw Error(t('auth.update_password_form.password_mismatch'));
      }
      const { error } = await updateUser({ password });
      if (error) throw error;
    } catch(err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box 
      component="form"
      sx={formSx}
    >
      <Stack direction="column" gap={4}>

        <TextField 
          label={t('auth.update_password_form.new_password')}
          value={password}
          onChange={(e) => setPassword(e.target.value as string)}
        />

        <TextField 
          label={t('auth.update_password_form.new_password_again')}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value as string)}
        />

        <ErrorAlert error={error} />

        <Button 
          variant="contained" 
          onClick={changePassword}
          disabled={!password || !passwordConfirm}
          loading={loading}
        >
          {t('auth.update_password_form.change_password')}
        </Button>
      </Stack>
    </Box>
  );
};