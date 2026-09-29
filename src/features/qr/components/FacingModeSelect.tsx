import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useTranslation } from 'react-i18next';


export type FacingModeSelectProps = {
  onSelect?: (facingMode: MediaTrackConstraintSet['facingMode']) => void;
};

const facingModes: MediaTrackConstraintSet['facingMode'] = [
  'environment',
  'user',
];

export const FacingModeSelect = ({ onSelect = () => {} }: FacingModeSelectProps) => {
  const { t } = useTranslation();
  
  return (
    <FormControl>
      <Select
        onChange={(e) => onSelect(e.target.value as MediaTrackConstraintSet['facingMode'])}
      >
        { facingModes.map((facingMode) => (
          <MenuItem key={facingMode} value={facingMode}>
            {facingMode === 'environment' && t('webcam.facing_modes.environment', { ns: 'common' })}
            {facingMode === 'user' && t('webcam.facing_modes.user', { ns: 'common' })}
          </MenuItem>
        )) }
      </Select>
    </FormControl>
  );
};