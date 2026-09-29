import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useDevices } from '@yudiel/react-qr-scanner';
import type { ChangeEvent } from 'react';

export type ScanDeviceSelectProps = {
  onSelect?: (device: MediaDeviceInfo) => void;
}

type DeviceChangeEvent = ChangeEvent<HTMLInputElement, Element> | (Event & {
  target: {
    value: unknown;
    name: string;
  };
});

export const ScanDeviceSelect = ({ onSelect = () => {} } : ScanDeviceSelectProps) => {
  const devices = useDevices();

  const handleChange = (e: DeviceChangeEvent) => {
    const device = e.target.value as MediaDeviceInfo;
    onSelect(device);
  };

  return (
    <>
      {devices.length > 0 && (
        <FormControl>
          <Select
            onChange={handleChange}
            value={devices[0]}
          >
            { devices.map(({ deviceId, label }) => (
              <MenuItem key={deviceId} value={deviceId}>
                {label || `Camera ${deviceId}`}
              </MenuItem>
            )) }
          </Select>
        </FormControl>
      )}
    </>
  );
};