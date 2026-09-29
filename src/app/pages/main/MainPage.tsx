import { AuthForm } from '@features/auth/components/AuthForm';
import { Navigate, useNavigate, useSearchParams } from 'react-router';
import { useAuthContext } from '@/src/features/auth/context/useAuthContext';
import { Box, Container, Stack, useColorScheme, useMediaQuery, useTheme } from '@mui/material';
import imgForDark from '@src/assets/images/SmartNFC-logo_for-dark.png';
import imgForLight from '@src/assets/images/SmartNFC-logo_for-light.png';

import { acceptInvitation } from '@/src/features/organization-invitations/queries/mutationQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';
import { FeedbackSnackbar } from '@/src/components/feedback/snackbar/FeedbackSnackbar';
import { useTranslation } from 'react-i18next';
import { BasicAppBar } from '@/src/components/surfaces/BasicAppBar';
import { config } from '@/src/config/config';
import { SponsorLogos } from '@/src/components/surfaces/SponsorLogos';
import { wait } from '@/src/utils/async';
import { Page } from '@/src/components/surfaces/Page';

const navigateToAfterSignUp = '/dashboard';

export const MainPage = () => {
  const { t } = useTranslation('pages');
  const auth = useAuthContext();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { mode, systemMode } = useColorScheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('md'));

  const imgWidth = isSmallDevice && !isMobile ? '240px' : '380px';
  const activeMode = mode === 'system' ? systemMode : mode;

  const signUpAndAcceptInvitation = async (
    invitationId: string, 
    credentials: { 
      email: string; 
      password: string;
    }) => {
    const authRes = await auth.signUp(credentials.email, credentials.password);

    if (authRes && authRes.user) {
      try {
        await acceptInvitation(supabase, invitationId);
        await wait(1000);
      } catch(err) {
        console.warn('Error while accepting invitation', err);
      } finally {
        navigate(navigateToAfterSignUp);
      }
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    const invitationId = searchParams.get('invitationId');
    if (invitationId) {
      return signUpAndAcceptInvitation(invitationId, {email, password });
    }

    try {
      await auth.signUp(email, password);
    } catch(err) {
      console.warn('Error while signin up', err);
    } finally {
      navigate(navigateToAfterSignUp);
    }
  };

  if (auth.user) {
    if (!searchParams.get('bypassAuthCheck')) {
      return <Navigate to="/dashboard" />;
    }
  }

  return (
    <>
      <BasicAppBar />
      <Page title={config.app.name}>
        <Container sx={{ pt: '3rem', maxWidth: '920px' }}>
          <Stack 
            direction={isMobile ? 'column' : 'row'}
            alignItems='center'
            rowGap={6}
            gap={4}
          >
            <Stack 
              direction={isMobile ? 'column-reverse' : 'column'} 
              alignItems={isMobile ? 'center' : 'flex-start'}
            >
              <Box 
                component="img"
                src={activeMode === 'dark' ? imgForDark : imgForLight}
                alt={t('app.logo.alt', {ns: 'common'})}
                sx={{
                  flexGrow: 1,
                  width: imgWidth,
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
              <SponsorLogos />
            </Stack>

            <AuthForm
              mode={'sign-up'}
              error={auth.error}
              loading={auth.status === 'authenticating'}
              formSx={{
                flexGrow: 1,
              }}
              onSubmit={handleSignUp}
            />
          </Stack>  
            
          { searchParams.has('invitationId') && (
            <FeedbackSnackbar 
              id="main-page-invite-snackbar"
              severity="success"
              content={t(
                'main.invitation-snackbar-content', 
                { 
                  inviterEmail: searchParams.get('inviterEmail') || '-',
                  orgName: searchParams.get('orgName') || '-',
                }
              )}
            />
          ) }
        </Container> 
      </Page>
    </>
  );
};