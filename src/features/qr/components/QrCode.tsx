import type { PropsOf } from '@emotion/react';
import { QRCodeSVG } from 'qrcode.react';

export type QRCodeProps = PropsOf<typeof QRCodeSVG>;

export const QrCode = (props: QRCodeProps) => {
  return <QRCodeSVG {...props} />;
};