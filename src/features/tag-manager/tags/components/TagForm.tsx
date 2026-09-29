import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import { useState } from 'react';

import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import type { SubmitEvent } from 'react';
import type { Tag, TagFormData } from '../types';
import AppAccordion from '@/src/components/surfaces/AppAccordion';
import { KeywordSelect } from '../../keywords/components/KeywordSelect';
import type { Keyword } from '../../keywords/types';
import { SelectedKeywords } from '../../keywords/components/SelectedKeywords';
import type { ZodError } from 'zod';
import { ErrorAlert } from '@/src/components/feedback/ErrorAlert';
import { useTagKeywordMutations } from '../../keywords/hooks/useTagKeywordMutations';

const defaultTagFormData: TagFormData = {
  address: '',
  building: '',
  floor: '',
  room: '',
  specific_location: '',
  label: '',
  folder_id: '',
};

export interface TagFormProps {
  includeDefaultTitle?: boolean;
  mode?: 'edit' | 'create';
  initialData?: Tag;
  initialKeywords?: Keyword[];
  error?: ZodError | Error | string | null;
  onSubmit: (tag: TagFormData, keywords?: Keyword[]) => Promise<unknown>;
};

export const TagForm = ({ 
  mode = 'create', 
  includeDefaultTitle = false,
  initialData, 
  initialKeywords = [],
  error = null,
  onSubmit, 
}: TagFormProps) => {
  const { t } = useTranslation(['common', 'components']);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tagData, setTagData] = useState<TagFormData>(
    (initialData as TagFormData) || defaultTagFormData
  );
  const [keywords, setKeywords] = useState<Keyword[]>(initialKeywords);
  const [loading, setLoading] = useState<boolean>(false);
  const { deleteMutation } = useTagKeywordMutations();

  const addKeyword = (keyword: Keyword | null) => {
    if (keyword) {
      if (keywords.find(({ id }) => id === keyword.id)) return;
      setKeywords((values) => [...values, keyword]);
    }
  };

  const deleteKeyword = async (id: string) => {
    if (!confirm(t('tags.form.confirm_keyword_delete', { ns: 'components' }))) return;
    if (!id) throw Error('Keyword id missing');
    if (!initialData?.id) throw Error('Tag id missing');

    return deleteMutation.mutateAsync({ keywordId: id, tagId: initialData.id });
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(tagData, keywords);
    } catch(err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      component='form' 
      noValidate 
      autoComplete='off' 
      width="100%"
      onSubmit={handleSubmit}
    >
      <Stack direction="column" gap={4}>
        { includeDefaultTitle && (
          <Typography variant='h4' align={isMobile ? 'center' : 'left'}>
            { mode === 'edit' ? 
              t('tags.form.label_input.label', { ns: 'components' }) 
              :  
              t('tags.form.title', { ns: 'components' }) 
            }
          </Typography>
        ) }

        <TextField
          id="label-input"
          label={t('tags.form.label_input.label', { ns: 'components' })}
          placeholder={t('tags.form.label_input.placeholder', { ns: 'components' })}
          type="text"
          variant="outlined"
          value={tagData.label}
          disabled={loading}
          onChange={(e) => setTagData({
            ...tagData,
            label: e.target.value,
          })}
        />

        <KeywordSelect onSelect={addKeyword} />
        <SelectedKeywords 
          values={keywords} 
          setValues={setKeywords}
          onDelete={deleteKeyword} 
        />

        <AppAccordion title="Add location information">
          <Stack direction="column" gap={4}>
            <TextField
              id="address"
              label={`
                ${t('tags.form.address_input.label', { ns: 'components' })}
                (${t('optional', { ns: 'common' })})
              `}
              placeholder={t('tags.form.address_input.placeholder', { ns: 'components' })}
              type="text"
              variant="outlined"
              value={tagData.address}
              disabled={loading}
              onChange={(e) => setTagData({
                ...tagData,
                address: e.target.value,
              })}
            />
            <TextField
              id="room"
              label={`
                ${t('tags.form.room_input.label', { ns: 'components' })}
                (${t('optional', { ns: 'common' })})
              `}
              placeholder={t('tags.form.room_input.placeholder', { ns: 'components' })}
              type="text"
              variant="outlined"
              value={tagData.room}
              disabled={loading}
              onChange={(e) => setTagData({
                ...tagData,
                room: e.target.value,
              })}
            />
            <TextField
              id="specific-location"
              label={`
                ${t('tags.form.specific_location_input.label', { ns: 'components' })}
                (${t('optional', { ns: 'common' })})
              `}
              placeholder={t('tags.form.specific_location_input.placeholder', { ns: 'components' })}
              type="text"
              variant="outlined"
              value={tagData.specific_location}
              disabled={loading}
              onChange={(e) => setTagData({
                ...tagData,
                specific_location: e.target.value,
              })} 
            />
          </Stack>
        </AppAccordion>
        
        {error && (
          <ErrorAlert error={error} />
        )}
        
        <Button
          type="submit"
          variant="contained"
          loading={loading}
          // disabled={!name}
        >
          { mode === 'edit' ? 
            t('submit_edit_btn', { ns: 'common' })
            :
            t('tags.form.submit_btn', { ns: 'components' })
          }
        </Button>
      </Stack>
    </Box>
  );
};