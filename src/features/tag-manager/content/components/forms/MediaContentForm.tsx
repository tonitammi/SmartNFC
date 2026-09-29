import { useState } from 'react';
import { Box, Button, FormControlLabel, Stack, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { MediaContentType } from '../../types';
import { getInitialMediaContentObj } from '../../data';
import { MediaSelectDialog } from '@/src/components/media/MediaSelectDialog';


export interface MediaContentFormProps<T extends keyof MediaContentType> {
  type: T;
  title: string;
  initialValue?: MediaContentType[T];
  onSave: (data: MediaContentType[T]) => void;
}

export const MediaContentForm = <T extends keyof MediaContentType, >({
  type,
  initialValue,
  onSave,
}: MediaContentFormProps<T>) => {

  const { t } = useTranslation('components');
  const [contentObj, setContentObj] = useState<MediaContentType[T]>(
    () => (initialValue || getInitialMediaContentObj(type))
  );

  const updateField = (field: keyof MediaContentType[T], value: unknown) => {
    if (field in contentObj) {
      setContentObj({ ...contentObj, [field]: value });
    }
  };

  return (
    <Stack gap={4} sx={{ mt: 2 }}>
      <Typography variant="body1">Editor type: Media</Typography>
      <TextField
        label={t('content.editor.common.label_input.label')}
        value={contentObj.label}
        onChange={(e) => updateField('label' as keyof MediaContentType[T], e.target.value)}
        fullWidth
      />

      {type === 'text' && 'content' in contentObj && (
        <TextField
          label={t('content.editor.text_editor.content_input.label')}
          multiline rows={6}
          value={contentObj.content}
          onChange={(e) => updateField('content' as keyof MediaContentType[T], e.target.value)}
          fullWidth
        />
      )}

      {(type === 'audio' || type === 'image' || type === 'video' || type === 'document') && 'url' in contentObj && (
        <>
          <TextField
            label={t('content.editor.common.url_input.label')}
            type="url"
            value={contentObj.url}
            onChange={(e) => updateField('url' as keyof MediaContentType[T], e.target.value)}
            fullWidth
          />

          {type === 'document' && 'download' in contentObj && (
            <FormControlLabel 
              control={
                <Switch 
                  checked={contentObj.download} 
                  slotProps={{ input: { 'aria-label': 'controlled' } }}
                  onChange={(e) => updateField('download' as keyof MediaContentType[T], e.target.checked)}
                />
              } 
              label={t('content.editor.document_editor.download')}
            />
          )}

          <Stack direction="row" gap={4} justifyContent="flex-end">
            {contentObj.url && type === 'image' && (
              <Box 
                component="img"
                src={contentObj.url}
                sx={{ width: 120 }}
              />
            )}
            {type !== 'document' && type !== 'video' && (
              <MediaSelectDialog 
                defaultFolder={type}
                buttonProps={{
                  sx: { height: 'max-content' },
                }}
                onSelect={
                  (file) => updateField('url' as keyof MediaContentType[T], file.publicUrl)
                }
              />
            )}

          </Stack>
        </>
      )}

      <TextField
        label={t('content.editor.common.description_input.label')}
        multiline rows={3}
        value={contentObj.description || ''}
        onChange={(e) => updateField('description' as keyof MediaContentType[T], e.target.value)}
        fullWidth
      />

      <Button variant="contained" onClick={() => onSave(contentObj)}>
        {t('save', { ns: 'common' })}
      </Button>
    </Stack>
  );
};