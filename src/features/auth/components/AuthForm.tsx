import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Trans, useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, type SxProps, type Theme } from '@mui/material/styles';
import type { SubmitEvent } from 'react';
import { useSearchParams } from 'react-router';

export type AuthFormProps = {
  loading?: boolean;
  error?: string | null;
  mode?: 'sign-up' | 'sign-in';
  requireAccept?: boolean;
  redirect?: string | URL;
  formSx?: SxProps<Theme>;
  onSubmit: (email: string, password: string) => void | Promise<void>;
}

export const AuthForm = ({ 
  mode = 'sign-in', 
  loading = false, 
  requireAccept = true, 
  error = '',
  formSx = {},
  onSubmit, 
}: AuthFormProps) => {
  const { t } = useTranslation(['common', 'components']);
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState<string>(searchParams.get('email') || '');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // const [invitationId] = useState<string | null>(searchParams.get('invitationId'));
  const [acceptTermsAndPolicies, setAcceptTermsAndPolicies] = useState<boolean>(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return;
    if (mode === 'sign-up' && requireAccept) {
      if (!acceptTermsAndPolicies) return;
    }
    onSubmit(email, password);
  };

  return (
    <Box 
      component='form' 
      noValidate 
      autoComplete='off' 
      maxWidth="640px" 
      width="100%"
      sx={formSx}
      onSubmit={(e) => handleSubmit(e)}
    >
      <Stack direction="column" gap={4}>
        <Typography variant='h4' align={isMobile ? 'center' : 'left'}>
          {mode === 'sign-in' ? 
            t('auth.auth_form.sign_in_title', { ns: 'components' }) 
            : 
            t('auth.auth_form.sign_up_title', { ns: 'components' })
          }
        </Typography>
        <TextField
          id="email-input"
          label={t('auth.common.email_input.label', { ns: 'components' })}
          placeholder={t('auth.common.email_input.placeholder', { ns: 'components' })}
          type="email"
          autoComplete="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            {t('auth.common.password_input.label', { ns: 'components' })}
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            label={t('auth.common.password_input.label', { ns: 'components' })}
            type={showPassword ? 'text' : 'password'}
            placeholder={t('auth.common.password_input.placeholder', { ns: 'components' })}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}

            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />          
        </FormControl>

        { mode === 'sign-up' &&  
          <FormControlLabel
            style={{
              textAlign: isMobile ? 'center' : 'left',
            }}
            control={
              <Checkbox 
                checked={acceptTermsAndPolicies} 
                onChange={(e) => setAcceptTermsAndPolicies(e.target.checked)} 
              />
            }
            label={
              <Trans
                ns={['components']}
                i18nKey="auth.auth_form.accept_policies"
                components={{
                  1: <Link href="/terms" />,
                  2: <Link href="/privacy" />,
                }}
              />
            }
            required={requireAccept}
          />
        }

        { error && <p>{t('error', { ns: 'common' })}: {error}</p> }

        <Button 
          type="submit"
          variant="contained"
          disabled={!email || !password} 
          loading={loading}
        >
          {
            mode === 'sign-in' ? 
              t('auth.auth_form.submit_sign_in', { ns: 'components' })
              : 
              t('auth.auth_form.submit_sign_up', { ns: 'components' })
          }
        </Button>

        <div style={{ textAlign: 'center' }}>
          <Typography variant="body2">
            { mode === 'sign-up' ? 
              <Trans
                ns={['components']}
                i18nKey="auth.auth_form.link_to_login"
                components={{
                  1: <Link href="/login" />,
                }}
              />
              :
              <Trans
                ns={['components']}
                i18nKey="auth.auth_form.link_to_sign_up"
                components={{
                  1: <Link href="/sign-up" />,
                }}
              />
            }
          </Typography>
          
        </div>
      </Stack>
    </Box>
  );
};