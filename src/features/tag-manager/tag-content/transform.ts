import type { TagContent } from './types';

/**
 * Transforms content entry to TagContent object
 * @param {string} tagId 
 * @param {TagContent['content']} contentEntry 
 * @returns {TagContent} 
 */
export const toTagContent = (
  tagId: string, 
  contentEntry: TagContent['content']
): TagContent => {
  return {
    tag_id: tagId,
    content: contentEntry,
  }; 
};