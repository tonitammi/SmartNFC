import { MediaTabs } from '@/src/components/media/MediaTabs';
import { Page } from '@/src/components/surfaces/Page';
import { useOrganizationContext } from '@/src/features/organization/context/useOrganizationContext';
import { useTranslation } from 'react-i18next';

export const MediaBrowserPage = () => {
  const { t } = useTranslation('pages');
  const { currentOrganization } = useOrganizationContext('true');

  return (
    <Page title={t('media.browser.title')}>
      <MediaTabs 
        orgId={currentOrganization.id}
      />
    </Page>
  );
};