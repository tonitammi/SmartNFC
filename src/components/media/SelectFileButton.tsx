import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import type { ChangeEventHandler, ComponentPropsWithoutRef, ReactNode } from 'react';
// import { ACCEPTED_MIME_TYPES } from '@src/features/storage/constants';
import type { PropsOf } from '@emotion/react';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export interface UploadFileButtonProps extends ComponentPropsWithoutRef<'input'> {
  onFileSelected: (file: File | FileList) => void;
  mimeType?: string;
  children?: ReactNode | ReactNode[];
  uploadMultiple?: boolean;
  icon?: ReactNode;
  variant?: PropsOf<typeof Button>['variant'];
};

export const SelectFileButton = ({ 
  children, 
  mimeType = 'image/*',
  uploadMultiple = false, 
  onFileSelected, 
  icon, 
  variant,
  ...restInputProps 
} : UploadFileButtonProps) => {

  const handleChange: ChangeEventHandler<HTMLInputElement, HTMLInputElement> = (e) => {
    const { files } = e.target;
    if (!files) return;

    if (uploadMultiple) return onFileSelected(files);
    return onFileSelected(files[0]);
  };

  return (
    <Button
      component="label"
      role={undefined}
      variant={variant}
      tabIndex={-1}
      startIcon={ icon || <UploadFileIcon />}
    >
      {children || null}
      <VisuallyHiddenInput
        type="file"
        onChange={handleChange}
        accept={mimeType}
        {...restInputProps}
      />
    </Button>
  );
};