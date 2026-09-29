import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { useOrganizationContext } from '@src/features/organization/context/useOrganizationContext';
import { usePublicStorageMutations } from '@src/features/storage/hooks/usePublicStorageMutations';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { SelectFileButton } from './SelectFileButton';
import { generateFileName, getFileExtension, getFolderByMimeType } from '@src/features/storage/utils';
import type { FileMetadata } from './FileUpload';
import { ErrorAlert } from '../feedback/ErrorAlert';

export interface FileUploadDialogProps {
  buttonText?: string;
  mimeType?: string;
  afterUpload?: (file: File, metadata: FileMetadata) => void;
  onError?: (msg: string) => void;
}

export const FileUploadDialog = ({ 
  buttonText = '', 
  mimeType = 'image/*',
  afterUpload = () => {},
  onError = () => {},
} : FileUploadDialogProps) => {
  const { currentOrganization } = useOrganizationContext('true');
  const insertMutation = usePublicStorageMutations(currentOrganization.id);
  const { t } = useTranslation('common');
  const [ open, setOpen ] = useState<boolean>(false);
  const [ file, setFile ] = useState<File | null>(null);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  
  const handleFileSelect = (file: File | FileList) => {
    if (file instanceof File) {
      return setFile(file);
    }
    setFile(file[0]);
  };
  
  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);

    const folder = getFolderByMimeType(file);
    const filename = generateFileName(file);
    const extension = getFileExtension(file);

    try {
      const data = await insertMutation.mutateAsync({ 
        file, 
        folder, 
        filename, 
      });

      if (data) {
        afterUpload(file, {
          folder,
          filename,
          extension,
        });
      };
      setOpen(false);

    } catch(err) {
      console.log(err);
      onError((err as Error).message);
    } finally {
      setIsLoading(false);
    }

  };

  const handleClose = () => {
    setOpen(false);
    setFile(null);
  };

  return (
    <>
      <Button 
        variant="contained" 
        startIcon={<FileUploadIcon />}
        size="small"
        onClick={() => setOpen(true)}
      >
        {buttonText}
      </Button>
      
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth='sm'
        fullWidth
      > 
        <DialogTitle>Upload file</DialogTitle>
        <DialogContent>
          <Stack gap={2}>
            <SelectFileButton 
              mimeType={mimeType}
              variant={!file ? 'contained' : 'outlined'}
              onFileSelected={handleFileSelect}
            >
              { file ?  t('actions.change_file') : t('actions.select_file') }
            </SelectFileButton>

            <Typography variant="body1" sx={{ textWrap: '' }}>
              {file?.name || ''}
            </Typography>

            {insertMutation.isError && (
              <>
                <ErrorAlert error={insertMutation.error} />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" gap={4}>
            <Button 
              variant="text"
              disabled={isLoading}
              onClick={handleClose}
            >
              { t('cancel') }
            </Button>
            <Button 
              variant="contained"
              startIcon={<CloudUploadIcon />}
              disabled={!file || isLoading}
              onClick={handleUpload}
            >
              { t('upload') }
            </Button>
          </Stack>
            
        </DialogActions>
      </Dialog>
    </>
  );
};