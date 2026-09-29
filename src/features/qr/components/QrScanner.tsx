import type { PropsOf } from '@emotion/react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';
import { ScanDeviceSelect } from './ScanDeviceSelect';
import { FacingModeSelect } from './FacingModeSelect';

type ScannerProps = PropsOf<typeof Scanner>;

export const QrScanner = (props : ScannerProps) => {
  const [device, setDevice] = useState<MediaDeviceInfo>();
  const [facingMode, setFacingMode] = useState<MediaTrackConstraintSet['facingMode']>('environment');

  return (
    <>
      <ScanDeviceSelect onSelect={(d) => setDevice(d)} />
      <FacingModeSelect onSelect={(f) => setFacingMode(f)} />

      <Scanner
        {...props}
        constraints={{
          ...props.constraints,
          facingMode,
          deviceId: device?.deviceId || undefined,
        }}
      />
    </>
  );
};