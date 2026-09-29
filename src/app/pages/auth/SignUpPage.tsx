import { AuthForm } from '@features/auth/components/AuthForm';
import { useAuthContext } from '@/src/features/auth/context/useAuthContext';
import { AuthPageLayout } from '@/src/layouts/AuthPageLayout';
import { useTranslation } from 'react-i18next';

export const SignUpPage = () => {
  const auth  = useAuthContext();
  const { t } = useTranslation('common');
  
  return (
    <>
      <title>{t('pages.sign_up')}</title>
      <AuthPageLayout>      
        <AuthForm 
          mode="sign-up"
          onSubmit={(email, password) => { auth.signUp(email, password); }} 
          loading={auth.status === 'authenticating'} 
          error={auth.error}
        />
      </AuthPageLayout>
    </>
  );
};