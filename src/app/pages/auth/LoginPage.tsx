import { AUTH_REDIRECT_KEY  } from '@features/auth/constants';
import { useSearchParams } from '@hooks/useSearchParams';
import { AuthForm } from '@features/auth/components/AuthForm';
import { useAuthContext } from '@/src/features/auth/context/useAuthContext';
import { AuthPageLayout } from '@/src/layouts/AuthPageLayout';
import { useTranslation } from 'react-i18next';

export const LoginPage = () => {
  const redirectUrl = useSearchParams(AUTH_REDIRECT_KEY);
  const auth  = useAuthContext();
  const { t } = useTranslation('common');
  
  return (
    <>
      <title>{t('pages.login')}</title>
      <AuthPageLayout>
        <AuthForm 
          mode="sign-in"
          onSubmit={(email, password) => { auth.signIn(email, password, redirectUrl); }} 
          loading={auth.status === 'authenticating'} 
          error={auth.error}
        />
      </AuthPageLayout>
    </>
  );
};