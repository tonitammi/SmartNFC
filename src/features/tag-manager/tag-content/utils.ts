import { config } from '@/src/config/config';

export const getTagContentURL = (tagId: string, publicUrl: boolean = true) => {
  const appUrl = publicUrl ? config.app.publicUrl : config.app.url;
  const contentPath = 'app/content';

  return `${appUrl}/${contentPath}/${tagId}`;
};