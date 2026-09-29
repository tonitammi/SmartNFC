import { Button, FormControlLabel, Checkbox, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import type { Action, ActionContent } from '../../types';
import { useTranslation } from 'react-i18next';

export interface ActionFormProps {
  initialValue?: ActionContent;
  onSave: (val: ActionContent) => void;
}

export const ActionForm = ({ initialValue, onSave }: ActionFormProps) => {
  const { t } = useTranslation('components');
  const [data, setData] = useState<ActionContent>(initialValue || {
    version: 1,
    content_type: 'action',
    label: '',
    label_type: 'button',
    action: { action_name: 'call', tel: '', version: 1 },
  });

  const handleActionTypeChange = (type: string) => {
    const actions: Record<string, Action> = {
      call: { action_name: 'call', tel: '', version: 1 },
      sms: { action_name: 'sms', tel: '', msg: '', version: 1 },
      redirect: { action_name: 'redirect', url: '', auto_redirect: false, version: 1 },
      whatsapp: { action_name: 'whatsapp', tel: '', msg: '', version: 1 },
    };
    setData({ ...data, action: actions[type] });
  };

  const updateActionData = (
    field: string, 
    value: unknown
  ) => {
    if (field in data.action) {
      setData({
        ...data, 
        action: {
          ...data.action,
          [field]: value,
        },
      });
    }
  };

  return (
    <Stack gap={3} sx={{ mt: 2 }}>
      <Typography variant="body1">Editor type: Action</Typography>
      <Select 
        label={t('actions.action', { ns: 'common' })} 
        value={data.action.action_name}
        onChange={(e) => handleActionTypeChange(e.target.value)}
      >
        <MenuItem value='call'>
          {t('content.actions.action_names.call')}
        </MenuItem>
        <MenuItem value='sms'>
          {t('content.actions.action_names.sms')}
        </MenuItem>
        <MenuItem value='whatsapp'>
          {t('content.actions.action_names.whatsapp')}
        </MenuItem>
        <MenuItem value='redirect'>
          {t('content.actions.action_names.redirect')}
        </MenuItem>
      </Select>

      <TextField 
        label="Button label" 
        value={data.label} 
        onChange={(e) => setData({ ...data, label: e.target.value })} 
      />
      
      {(
        data.action.action_name === 'call' || 
        data.action.action_name === 'sms' || 
        data.action.action_name === 'whatsapp'
      ) && (
        <TextField 
          label={t('fields.tel', { ns: 'common'})}
          type="tel"
          value={data.action.tel} 
          onChange={(e) => updateActionData('tel', e.target.value)} 
        />
      )}

      {(
        data.action.action_name === 'sms' || 
        data.action.action_name === 'whatsapp'
      ) && (
        <TextField 
          label={t('fields.message', { ns: 'common'})}
          value={data.action.msg} 
          onChange={(e) => updateActionData('msg', e.target.value)} 
        />
      )}

      {data.action.action_name === 'redirect' &&(
        <>
          <TextField 
            label={t('fields.url', { ns: 'common' })}
            value={data.action.url} 
            onChange={(e) => updateActionData('url', e.target.value)} 
          />

          <FormControlLabel 
            label="Auto redirect"
            control={(
              <Checkbox 
                checked={data.action.auto_redirect} 
                onChange={(e) => updateActionData('auto_redirect', e.target.checked)}
                slotProps={{
                  input: { 'aria-label': 'controlled' },
                }}
              />
            )}
          />
        </>
      )}

      <Button variant="contained" onClick={() => onSave(data)}>
        Save action
      </Button>
    </Stack>
  );
};