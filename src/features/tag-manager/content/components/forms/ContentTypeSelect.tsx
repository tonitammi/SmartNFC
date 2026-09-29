import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { MEDIA_CONTENT_TYPES } from '../../constants';
import { useState, type ChangeEvent } from 'react';
import type { ContentType, MediaContentType } from '../../types';
import { Capitalized } from '@/src/components/utils/formatting/Capitalized';
import { useTranslation } from 'react-i18next';

export interface ContentTypeSelectProps {
  defaultValue?: keyof MediaContentType;
  onSelect?: (value: keyof MediaContentType) => void;
};

export const ContentTypeSelect = ({ 
  defaultValue = 'text', 
  onSelect = () => {}, 
}: ContentTypeSelectProps) => {
  const { t } = useTranslation('components');
  const [selectedValue, setSelectedValue] = useState<ContentType>(defaultValue);
  const [ labelId ] = useState<string>('content-select-' + crypto.randomUUID());

  const handleChange = (e: ChangeEvent<HTMLInputElement, Element> | (Event  & {
    target: {
        value: ContentType;
        name: string;
    };
  })) => {
    const value = e.target.value as keyof MediaContentType;
    setSelectedValue(value);
    return value && onSelect(value);
  };

  return (
    <FormControl>
      <InputLabel id={labelId}>
        {t('content.content_select.label')}
      </InputLabel>
      <Select 
        labelId={labelId}
        label={t('content.content_select.label')}
        value={selectedValue} 
        sx={{
          minWidth: '14rem',
        }}
        onChange={handleChange}
      >
        {MEDIA_CONTENT_TYPES.map((contentType) => (
          <MenuItem key={contentType} value={contentType}>
            <Capitalized text={contentType.replaceAll('_', ' ')} /> 
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};