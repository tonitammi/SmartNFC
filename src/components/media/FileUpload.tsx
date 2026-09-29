import { useTranslation } from 'react-i18next';
import { SelectFileButton } from './SelectFileButton';
import { useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { generateFileName, getFileExtension, getFolderByMimeType } from '@src/features/storage/utils';
import type { PublicStorageFolder } from '@src/features/storage/types';

export interface FileMetadata {
  folder: PublicStorageFolder | null;
  filename: string;
  extension: string;
}

export interface FileUploadProps {
  onUpload: (file: File, metadata: FileMetadata) => void;
}

export const FileUpload = ({ onUpload }: FileUploadProps) => {
  const { t } = useTranslation('common');
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | FileList) => {
    if (file instanceof File) {
      return setFile(file);
    }
    setFile(file[0]);
  };

  const removeSelectedFile = () => setFile(null);

  const handleUpload = () => {
    if (!file) return;
    const folder = getFolderByMimeType(file);
    const filename = generateFileName(file);
    const extension = getFileExtension(file);

    onUpload(file, {
      folder,
      filename,
      extension,
    });
  };

  return (
    <>
      <Stack gap={2} sx={{ width: 'max-content', maxWidth: '100%' }}>
        <SelectFileButton onFileSelected={handleFileSelect}>
          { file ?  t('actions.change_file') : t('actions.select_file') }
        </SelectFileButton>

        <Typography variant="body1" sx={{ textWrap: '' }}>
          {file?.name || ''}
        </Typography>
        
        <Stack 
          direction="row" 
          alignItems="center" 
          justifyContent="flex-end" 
          gap={4}
          sx={{ marginTop: 2 }}
        >
          { file && (
            <Button color="error" onClick={removeSelectedFile}>
              { t('cancel') }
            </Button>
          ) }
          <Button 
            variant="contained"
            startIcon={<CloudUploadIcon />}
            disabled={!file}
            onClick={handleUpload}
          >
            { t('upload') }
          </Button>
        </Stack>
      </Stack>
    </>
  );
};