import { useState } from 'react';
import type { ContentEntry, ContentJSON, ContentJSONType, InsertContentEntry, UpdateContentEntry } from '../../types';
import { Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { BlockEditor } from '../editors/BlockEditor';
import AppAccordion from '@/src/components/surfaces/AppAccordion';

type ContentEntryMode = {
  mode: 'create';
  initialData?: null;
} | {
  mode: 'create-and-assign';
  initialData?: null;
} | {
  mode: 'edit';
  initialData: ContentEntry;
};

interface ContentEntryFormBaseProps {
  orgId: string;
  showCancel?: boolean;
  onSave: (data: InsertContentEntry | UpdateContentEntry | ContentEntry) => void | Promise<void>;
  onCancel: () => void | Promise<void>;
};

export type ContentEntryFormProps = ContentEntryFormBaseProps & ContentEntryMode;

export const ContentEntryForm = ({ 
  orgId, 
  mode = 'create', 
  initialData = null, 
  showCancel = false,
  onCancel, 
  onSave, 
} : ContentEntryFormProps) => {
  const initialContentData = initialData && 'content_data' in initialData && Array.isArray(initialData.content_data)
    ? (initialData.content_data as ContentJSONType[])
    : [];

  const { t } = useTranslation('common');
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [data, setData] = useState<InsertContentEntry>(() => {
    if (initialData) {
      return {
        title: initialData.title ?? '',
        is_shared: initialData.is_shared ?? true,
        org_id: initialData.org_id ?? orgId,
        required_role: initialData.required_role ?? 'visitor',
        status: initialData.status ?? 'draft',
        content_data: initialContentData,
      };
    }

    return {
      title: '',
      is_shared: true,
      org_id: orgId,
      required_role: 'visitor',
      status: 'draft',
      content_data: [],
    };
  });

  const updateField = (field: keyof typeof data, value: unknown) => {
    setData({
      ...data,
      [field]: value,
    });
  };

  const handleBlocksSave = (newBlocks: ContentJSONType[]) => {
    setData((prev) => ({
      ...prev,
      content_data: newBlocks,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    await onSave(data);
    setIsLoading(false);
  };

  // const toPreviewView = () => {
  //   const previewLink = generatePreviewLink(data);
  //   navigate(previewLink);
  // };

  return (
    <>
      <Box component="form" sx={{ marginBottom: '2rem' }}>
        <Stack gap={4}>
          <AppAccordion title="Content details" defaultExpanded>
            <Stack gap={4}>
              <TextField 
                label="Title"
                value={data.title}
                onChange={(e) => updateField('title', e.target.value)}
              />

              <FormControl fullWidth>
                <InputLabel id="content-entry-status">
                  {t('fields.content_status')}
                </InputLabel>
                <Select
                  labelId="content-entry-status"
                  label={t('fields.content_status')}
                  value={data.status || 'draft'}
                  onChange={(e) => updateField('status', e.target.value)}
                >
                  <MenuItem value="draft">
                    {t('field_values.draft')}
                  </MenuItem>
                  <MenuItem value="published">
                    {t('field_values.published')}
                  </MenuItem>
                </Select>
              </FormControl>

              
              <FormControl fullWidth>
                <InputLabel id="content-entry-required-role">
                  {t('fields.required_role')}
                </InputLabel>
                <Select
                  labelId="content-entry-required-role"
                  label={t('fields.required_role')}
                  value={data.required_role || 'visitor'}
                  onChange={(e) => updateField('required_role', e.target.value)}
                >
                  <MenuItem value="visitor">
                    {t('field_values.visitor')}
                  </MenuItem>
                  <MenuItem value="user">
                    {t('field_values.user')}
                  </MenuItem>
                  <MenuItem value="editor">
                    {t('field_values.editor')}
                  </MenuItem>
                  <MenuItem value="admin">
                    {t('field_values.admin')}
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel 
                label="Is shared content"
                control={
                  <Checkbox 
                    checked={!!data.is_shared} 
                    onChange={(e) => updateField('is_shared', e.target.checked)}
                    slotProps={{
                      input: { 'aria-label': 'controlled' },
                    }}
                  />
                }
              />              
            </Stack>
          </AppAccordion>     
        </Stack>
      </Box>
      
      <Typography variant="h4" sx={{ marginBottom: '1rem' }}>
        Content editor
      </Typography>
      
      {data.content_data && (
        <BlockEditor 
          initialData={data.content_data as ContentJSON}
          onSave={handleBlocksSave} 
        />
      )}

      <Stack 
        direction="row" 
        justifyContent="flex-end" 
        alignItems="center"
        gap={4}
        sx={{ marginTop: '2rem' }}
      >
        {showCancel && (
          <Button onClick={onCancel}>
            {t('cancel')}
          </Button>
        )}
        {/* <Button
          disabled={isLoading}
          onClick={toPreviewView}
        >
          {t('preview')}
        </Button> */}
        <Button 
          variant="contained" 
          loading={isLoading}
          disabled={isLoading}
          onClick={handleSave}
        >
          {mode === 'create' && t('actions.create')}
          {mode === 'create-and-assign' && t('actions.create_and_assign')}
          {mode === 'edit' && t('actions.save')}
        </Button>
      </Stack>
    </>
  );
};