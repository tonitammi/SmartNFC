import { 
  Box, 
  CircularProgress, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  CardActions, 
  Button, 
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import type { PublicStorageFolder, StorageFileObject } from '@src/features/storage/types';
import { usePublicStorageFolder } from '@src/features/storage/hooks/usePublicStorageFolder';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { FileUploadDialog } from './FileUploadDialog';
import { DateFormat } from '@/src/components/utils/formatting/DateFormat';
import { getMimeTypesByFolder } from '@/src/features/storage/utils';
import { MediaDetailsDialog } from './MediaDetailsDialog';

const renderAudioPlayer = (file: StorageFileObject) => (
  <Box sx={{ 
    width: '100%', 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 1,
    p: 2,
    background: 'linear-gradient(45deg, #f3f4f6 30%, #e5e7eb 90%)',
  }}>
    <VolumeUpIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
    <audio 
      controls 
      style={{ 
        width: '100%', 
        height: '32px',
        borderRadius: '8px',
      }}
    >
      <source src={file.publicUrl} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  </Box>
);

export interface MediaTabContentProps {
  orgId: string;
  folder: PublicStorageFolder;
  onSelect?: (file: StorageFileObject) => void;
}

export const MediaTabContent = ({ orgId, folder, onSelect }: MediaTabContentProps) => {
  const { t } = useTranslation('common');
  const mimeTypes = getMimeTypesByFolder(folder);
  const { 
    isLoading, 
    data: files = [], 
    refetch, 
  } = usePublicStorageFolder({ orgId, folder });

  const handleSelect = (file: StorageFileObject) => {
    if (onSelect) onSelect(file);
  };

  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {files?.length || 0} {t('media.files_found')}
        </Typography>

        <FileUploadDialog 
          mimeType={mimeTypes || undefined}
          buttonText={t('media.upload_new')}
          afterUpload={() => refetch()}
        />
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {files?.map((file) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={file.id}>
              <Card variant="outlined" sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: '0.2s',
                '&:hover': { boxShadow: 3, borderColor: 'primary.main' },
              }}>
                {/* Preview */}
                <Box sx={{ 
                  height: 140, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'action.hover',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {folder === 'image' && (
                    <CardMedia
                      component="img"
                      image={file.publicUrl}
                      alt={file.name}
                      sx={{ objectFit: 'cover', height: '100%', width: '100%' }}
                    />
                  )}

                  {folder === 'audio' && renderAudioPlayer(file)}

                  {folder === 'video' && (
                    <Box sx={{ textAlign: 'center' }}>
                      <VideoFileIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                      <Typography variant="caption" display="block">Video Preview</Typography>
                    </Box>
                  )}
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                  <Typography variant="subtitle2" noWrap title={file.name}>
                    {file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    <DateFormat date={file.created_at} format="localDate" />
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 1, pb: 1 }}>
                  <MediaDetailsDialog 
                    file={file}
                    icon={<InfoOutlinedIcon fontSize="small" />}
                    iconBtnProps={{ size: 'small' }}
                  />
                  { onSelect && (
                    <Button 
                      size="small" 
                      variant="text" 
                      onClick={() => handleSelect(file)}
                    >
                      {t('media.select')}
                    </Button>
                  ) }
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {files?.length === 0 && !isLoading && (
        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderStyle: 'dashed' }}>
          <Typography color="text.secondary">
            {t('media.no_files_in_folder')}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};