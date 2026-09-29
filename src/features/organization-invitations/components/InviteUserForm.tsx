import { Alert, AlertTitle, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { useAuthContext } from '../../auth/context/useAuthContext';
import { useOrganizationContext } from '../../organization/context/useOrganizationContext';
import { useInvitationMutations } from '../hooks/useInvitationMutations';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PropsOf } from '@emotion/react';
import { useFeedback } from '@/src/hooks/useFeedback';
import { useNavigate } from 'react-router';

type UserRole = 'user' | 'editor' | 'admin';

export interface InviteUserFormProps extends PropsOf<typeof Stack> {
  successUrl?: string;
  initialEmailValue?: string;
  initialRole?: UserRole;
};

export const InviteUserForm = ({ 
  successUrl,
  initialEmailValue = '', 
  initialRole = 'user', 
  ...restProps
} : InviteUserFormProps) => {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const { createSnackbar } = useFeedback();
  const { currentOrganization } = useOrganizationContext('true');
  const { insertMutation } = useInvitationMutations({
    orgId: currentOrganization.id,
    userEmail: user?.email || null,
  });
  const [email, setEmail] = useState<string>(initialEmailValue);
  const [role, setRole] = useState<UserRole>(initialRole);
  const [emailError, setEmailError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSuccess = () => {
    createSnackbar({
      severity: 'success',
      autoHideDuration: 3000,
      content: t('feedback.user_invited'),
    });
    
    if (!successUrl) {
      return navigate(`/dashboard/${currentOrganization.id}/users/invitations`);
    };
    navigate(successUrl);
  };

  const inviteUser = async () => {
    if (insertMutation.isPending) return;
    if (!email) return setEmailError('Email required');

    setEmailError(null);

    try {
      await insertMutation.mutateAsync({
        org_id: currentOrganization.id,
        org_name: currentOrganization.name,
        email,
        role,
      });

      handleSuccess();
    } catch(err) {
      console.log('err', err);
    }

  };

  return (
    <Stack gap={4} {...restProps}>
      <FormControl>
        <InputLabel htmlFor="invite-user-role-inp">
          {t('fields.user_role')}
        </InputLabel>
        <Select 
          id="invite-user-role-inp"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
        >
          <MenuItem value="user">
            {t('roles.user')}
          </MenuItem>
          <MenuItem value="editor">
            {t('roles.editor')}
          </MenuItem>
          <MenuItem value="admin">
            {t('roles.admin')}
          </MenuItem>
        </Select>

      </FormControl>

      <TextField 
        type="email"
        autoComplete={undefined}
        value={email}
        error={!!emailError}
        helperText={emailError ? emailError : ''}
        disabled={insertMutation.isPending}
        label={t('fields.email')}
        onChange={(e) => setEmail(e.target.value)}
      />

      {insertMutation.isError && (
        <Alert severity="error">
          <AlertTitle>{t('error', { ns: 'common' })}</AlertTitle>
          {insertMutation.error.message}
        </Alert>
      )}

      <Button
        variant="contained"
        disabled={!email || insertMutation.isPending}
        loading={insertMutation.isPending}
        onClick={inviteUser}
      >
        {t('actions.invite_user')}
      </Button>
    </Stack>
  );
  
};