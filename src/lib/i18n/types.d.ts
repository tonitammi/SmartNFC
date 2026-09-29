import 'i18next';
// Import example translations for typing (use english language files)
import enCommon from '@public/locales/en/common.json';
import enPages from '@public/locales/en/pages.json';
import enComponents from '@public/locales/en/components.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    // All recourses
    resources: {
      common: typeof enCommon;
      pages: typeof enPages;
      components: typeof enComponents;
    };
  }
}