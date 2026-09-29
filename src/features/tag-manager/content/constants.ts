import { ContentJSONSchema } from './schemas';
import type { ContentType, MediaContentType } from './types';

export const CONTENT_TYPES: ContentType[] = ContentJSONSchema.options.map(
  ({ shape }) => shape.content_type.value
);

export const MEDIA_CONTENT_TYPES: (keyof MediaContentType)[] = ['audio', 'document', 'image', 'video','text'];

export const CONTENT_VERSIONS: Record<ContentType, number> = {
  text: 1,
  audio: 1,
  image: 1,
  video: 1,
  document: 1,
  action: 1,
  smart_action: 1,
};