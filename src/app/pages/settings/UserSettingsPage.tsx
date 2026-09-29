import { Page } from '@/src/components/surfaces/Page';
import { UserSettings } from '@/src/features/user/components/UserSettings';
import { useTranslation } from 'react-i18next';

export const UserSettingsPage = () => {
  const { t } = useTranslation('common');
  return (
    <Page
      title={t('pages.user_settings')}
    >
      <UserSettings />
    </Page>
  );
};