import { createFilterOptions, Autocomplete, Button, Stack, TextField, CircularProgress } from '@mui/material';
import { useKeywords } from '../hooks/useKeywords';
import { useKeywordMutations } from '../hooks/useKeywordMutations';
import { useOrganizationContext } from '@/src/features/organization/context/useOrganizationContext';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { Add } from '@mui/icons-material';
import type { Keyword } from '../types';
import type { PropsOf } from '@emotion/react';

export type KeywordSelectProps = {
  onSelect?: (value: Keyword | null) => void | Promise<void>;
  buttonProps?: Omit<PropsOf<typeof Button>, 'onClick'>;
  stackProps?: PropsOf<typeof Stack>;
};

type TemporaryKeyword = {
  id: null;
  name: string;
  inputValue: string;
};

const filter = createFilterOptions<Keyword | TemporaryKeyword>();

export const KeywordSelect = ({ stackProps = {}, buttonProps = {}, onSelect }: KeywordSelectProps) => {
  const { t } = useTranslation('common');
  const label = useMemo(() => t('fields.keywords'), [t]);
  const { currentOrganization } = useOrganizationContext('true');
  
  const { data: keywords = [], isLoading } = useKeywords(currentOrganization.id);
  const { upsertMutation } = useKeywordMutations(currentOrganization.id);
  
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | TemporaryKeyword | null>(null);

  const handleAddAndSelect = async () => {
    if (!selectedKeyword) return;

    if (selectedKeyword.id === null) {
      try {
        const newKeyword = await upsertMutation.mutateAsync({
          org_id: currentOrganization.id,
          name: selectedKeyword.inputValue,
        });
        
        if (onSelect) onSelect(newKeyword);
        setSelectedKeyword(null); 
      } catch (error) {
        console.error('Keyword creation failed', error);
      }
    } else {
      if (onSelect) onSelect(selectedKeyword);
      setSelectedKeyword(null);
    }
  };

  return (
    <Stack flexDirection="row" gap={3} justifyContent="flex-start" alignItems="center" {...stackProps}>
      <Autocomplete
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        options={keywords as (Keyword | TemporaryKeyword)[]}
        loading={isLoading}
        getOptionLabel={(option) => {
          if (typeof option !== 'string' && 'inputValue' in option) {
            return option.inputValue;
          }
          return option.name;
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          const { inputValue } = params;
          
          const isExisting = options.some((option) => inputValue.toLowerCase() === option.name.toLowerCase());
          
          if (inputValue !== '' && !isExisting) {
            filtered.push({
              id: null,
              inputValue,
              name: `ADD: "${inputValue}"`,
            });
          }

          return filtered;
        }}
        onChange={(_event, newValue) => {
          if (typeof newValue === 'string') {
            setSelectedKeyword({ id: null, name: newValue, inputValue: newValue });
          } else {
            setSelectedKeyword(newValue);
          }
        }}
        renderInput={(params) => (
          <TextField 
            {...params} 
            label={label} 
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoading || upsertMutation.isPending ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
        sx={{ width: 300 }}
      />

      <Button
        variant="contained"
        startIcon={<Add />}
        disabled={!selectedKeyword || upsertMutation.isPending}
        onClick={handleAddAndSelect}
        {...buttonProps}
      >
        {upsertMutation.isPending ? t('actions.saving') : t('actions.add')}
      </Button>
    </Stack>
  );
};