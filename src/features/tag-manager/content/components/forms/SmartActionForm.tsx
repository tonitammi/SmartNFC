import { Button, FormControlLabel, Checkbox, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import type { SmartActionContent, SmartActionFetchDetails, SmartActionFetchDetailsType } from '../../types';
import { useTranslation } from 'react-i18next';
import { getInitialSmartAction } from '../../data';

export interface SmartActionFormProps {
  initialValue?: SmartActionContent;
  onSave: (val: SmartActionContent) => void;
}
export const SmartActionForm = ({ 
  initialValue, 
  onSave, 
}: SmartActionFormProps) => {
  const { t } = useTranslation('components');
  const [data, setData] = useState<SmartActionContent>(
    () => initialValue || getInitialSmartAction()
  );

  // Vaihtaa action_name -tyypin ('fetch' <-> 'other')
  const handleDetailsChange = (type: string) => {
    if (type === 'fetch') {
      const initialFetch = getInitialSmartAction().details as SmartActionFetchDetailsType;
      setData((prev) => ({ ...prev, details: initialFetch }));
    } else {
      setData((prev) => ({ ...prev, details: { action_name: 'other' } }));
    }
  };

  // Päivittää response_details.response_type -kentän
  const handleResponseDetailsChange = (
    responseType: 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text'
  ) => {
    if (data.details.action_name !== 'fetch') return;

    setData((prev) => {
      if (prev.details.action_name !== 'fetch') return prev;

      return {
        ...prev,
        details: {
          ...prev.details,
          response_details: {
            ...prev.details.response_details,
            response_type: responseType,
          },
        },
      };
    });
  };

  // Apufunktio Fetch-tyypin yksittäisten kenttien turvalliseen päivittämiseen
  const updateFetchField = <K extends keyof SmartActionFetchDetails>(
    field: K,
    value: SmartActionFetchDetailsType[K]
  ) => {
    if (data.details.action_name !== 'fetch') return;

    setData((prev) => {
      if (prev.details.action_name !== 'fetch') return prev;

      return {
        ...prev,
        details: {
          ...prev.details,
          [field]: value,
        },
      };
    });
  };

  const isFetch = data.details.action_name === 'fetch';

  const currentResponseType = isFetch
    ? (data.details as SmartActionFetchDetails).response_details?.response_type ?? 'json'
    : 'json';

  const headersValue = isFetch
    ? typeof (data.details as SmartActionFetchDetails).headers === 'object'
      ? JSON.stringify((data.details as SmartActionFetchDetails).headers, null, 2)
      : (data.details as SmartActionFetchDetails).headers ?? ''
    : '';

  const bodyValue = isFetch
    ? typeof (data.details as SmartActionFetchDetails).body === 'object'
      ? JSON.stringify((data.details as SmartActionFetchDetails), null, 2)
      : (data.details as SmartActionFetchDetails).body ?? ''
    : '';

  return (
    <Stack gap={3} sx={{ mt: 2 }}>
      <Typography variant="body1">Editor type: Smart action</Typography>
      
      <TextField 
        label="Label" 
        value={data.label} 
        onChange={(e) => setData({ ...data, label: e.target.value })} 
      />

      <Select 
        label={t('content.smart_actions.detail_type')} 
        value={data.details.action_name}
        onChange={(e) => handleDetailsChange(e.target.value)}
      >
        <MenuItem value="fetch">
          {t('content.smart_actions.fetch')}
        </MenuItem>
        <MenuItem value="other">
          {t('content.smart_actions.other')}
        </MenuItem>
      </Select>
  
      <FormControlLabel 
        label="Auto execution"
        control={(
          <Checkbox 
            checked={data.auto_execution} 
            onChange={(e) => setData({ 
              ...data, 
              auto_execution: e.target.checked,
            })}
            slotProps={{
              input: { 'aria-label': 'controlled' },
            }}
          />
        )}
      />

      {isFetch && (
        <>
          <TextField 
            label={t('fields.url_short', { ns: 'common' })}
            type="url"
            value={(data.details as SmartActionFetchDetails).url} 
            onChange={(e) => updateFetchField('url', e.target.value)} 
          />

          {/* Response Type Select */}
          <Select 
            label={t('content.smart_actions.detail_type')} 
            value={currentResponseType}
            onChange={(e) => 
              handleResponseDetailsChange(
                e.target.value as 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text'
              )
            }
          >
            <MenuItem value="json">Json</MenuItem>
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="arrayBuffer">ArrayBuffer</MenuItem>
            <MenuItem value="blob">Blob</MenuItem>
            <MenuItem value="formData">FormData</MenuItem>
          </Select>

          <TextField 
            label={t('content.smart_actions.headers')}
            value={headersValue} 
            rows={4}
            multiline={true}
            onChange={(e) => updateFetchField('headers', JSON.parse(e.target.value))} 
          />

          <TextField 
            label={t('content.smart_actions.body')}
            value={bodyValue} 
            rows={4}
            multiline={true}
            onChange={(e) => updateFetchField('body', e.target.value)} 
          />
        </>
      )}

      <Button variant="contained" onClick={() => onSave(data)}>
        Save smart action
      </Button>
    </Stack>
  );
};