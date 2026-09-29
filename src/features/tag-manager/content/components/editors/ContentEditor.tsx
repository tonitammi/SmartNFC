import type { MediaContentType } from '../../types';
import { MediaContentForm } from '../forms/MediaContentForm';
import { useTranslation } from 'react-i18next';

export interface ContentEditorProps<T extends keyof MediaContentType> {
  contentType: T;
  initialValue?: MediaContentType[T];
  onSave: <T extends keyof MediaContentType>(content: MediaContentType[T]) => void;
};

export const ContentEditor = <T extends keyof MediaContentType, >({ 
  contentType, 
  initialValue,
  onSave, 
} : ContentEditorProps<T>) => {
  const { t } = useTranslation('components');

  return (
    <>
      { contentType === 'text' &&  (
        <MediaContentForm
          type="text" 
          title={t('content.editor.text_editor.title')} 
          initialValue={initialValue as MediaContentType['text']}
          onSave={onSave<'text'>}
        />
      ) }

      { contentType === 'document' &&  (
        <MediaContentForm 
          type="document"
          title={t('content.editor.document_editor.title')} 
          initialValue={initialValue as MediaContentType['document']}
          onSave={onSave<'document'>}
        />
      ) }

      { contentType === 'audio' &&  (
        <MediaContentForm 
          type="audio" 
          title={t('content.editor.audio_editor.title')} 
          initialValue={initialValue as MediaContentType['audio']}
          onSave={onSave<'audio'>}
        />
      ) }

      { contentType === 'image' &&  (
        <MediaContentForm 
          type="image"
          title={t('content.editor.image_editor.title')} 
          initialValue={initialValue as MediaContentType['image']}
          onSave={onSave<'image'>}
        />
      ) }

      { contentType === 'video' &&  (
        <MediaContentForm 
          type="video"
          title={t('content.editor.video_editor.title')} 
          initialValue={initialValue as MediaContentType['video']}
          onSave={onSave<'video'>}
        />
      ) }
    </>
  );
};