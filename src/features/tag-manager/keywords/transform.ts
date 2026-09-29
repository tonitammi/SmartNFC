import type { Keyword } from './types';

type TagKeywords = {
  tag_keywords: Keyword;
}
export const tagKeywordsToKeywords = (data: TagKeywords[]) => {
  const keywords: Keyword[] = data.map(({ tag_keywords }) => {
    return tag_keywords;
  });

  return keywords;
};