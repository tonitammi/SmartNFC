import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import ReactPlayer from 'react-player';
import { useTranslation } from 'react-i18next';
import type { ContentJSONType } from '../types';
import type { SxProps } from '@mui/material';
import type { Theme } from '@mui/system';
import { getActionAttributes, handleVideoURL } from '../utils';
import { Redirect } from '@/src/components/navigation/Redirect';
import { Download } from '@mui/icons-material';
import { calculate169Height } from '@/src/utils/media';
import { SmartActionRenderer } from './SmartActionRenderer';

const cardVariant: 'elevation' | 'outlined' = 'outlined';

const cardStyles: SxProps<Theme> = {
  p: '1rem',
  pt: '1rem',
  pb: '2rem',
  mb: '2rem',
};

export interface ContentRendererProps {
  content: ContentJSONType;
}

export const ContentRenderer = ({ content }: ContentRendererProps) => {
  const { t } = useTranslation('common');
  const videoWidth = 480;
  const videoHeight = calculate169Height(videoWidth);
  
  const renderHeader = (label: string, description?: string) => (
    <Box mb={2}>
      <Typography variant="h6" component="h3" gutterBottom>
        {label}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
    </Box>
  );

  switch (content.content_type) {
    case 'text':
      return (
        <Card variant={cardVariant} sx={cardStyles}>
          <CardContent>
            {renderHeader(content.label, content.description)}
            <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
              {content.content}
            </Typography>
          </CardContent>
        </Card>
      );

    case 'document':
      return (
        <Card variant={cardVariant} sx={cardStyles}>
          <CardContent>
            {renderHeader(content.label, content.description)}
            <Button 
              href={content.url} 
              download={content?.download} 
              target="_blank"
              startIcon={content?.download && <Download />}
            >
              {content.label}
            </Button>
          </CardContent>
        </Card>
      );

    case 'image':
      return (
        <Card variant={cardVariant} sx={cardStyles}>
          <CardContent sx={{ textAlign: 'center' }}>
            {renderHeader(content.label, content.description)}
          </CardContent>
          <CardMedia
            component="img"
            height="auto"
            image={content.url}
            alt={content.label}
            sx={{ 
              maxHeight: 400, 
              objectFit: 'contain', 
              bgcolor: 'background.default',
            }}
          />
        </Card>
      );
    
    case 'video':
      return (
        <Card variant={cardVariant} sx={cardStyles}>
          <CardContent sx={{ textAlign: 'center' }}>
            {renderHeader(content.label, content.description)}

            <Stack alignContent="center" justifyContent="center">
              <ReactPlayer 
                src={handleVideoURL(content.url)} 
                style={{ marginLeft: 'auto', marginRight: 'auto' }}
                width="100%"
                height={videoHeight}
                controls={true} 
              />
            </Stack> 
          </CardContent>
        </Card>
      );
    case 'audio':
      return (
        <Card variant={cardVariant} sx={cardStyles}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <AudioFileIcon color="primary" fontSize="large" />
              <Box flexGrow={1}>
                {renderHeader(content.label, content.description)}
                <audio controls src={content.url} style={{ width: '100%', marginTop: '8px' }}>
                  Selaimesi ei tue audio-elementtiä.
                </audio>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      );

    case 'action': {
      const { action, label, label_type } = content;
      const { href, IconComponent, target, rel } = getActionAttributes(action);
      const isButton = label_type === 'button';

      return (
        <Card variant={cardVariant} sx={cardStyles}>
          <CardContent sx={{ textAlign: 'center' }}>
            {renderHeader(label)}
            {/* <Typography variant="subtitle1" gutterBottom>
              {label}
            </Typography> */}
            
            {action.action_name === 'redirect' && action.auto_redirect && (
              <Typography variant="caption" color="warning.main" display="block" mb={1}>
                <Redirect url={action.url} timeout={2000} />
              </Typography>
            )}

            <Box sx={{ mt: '2rem' }}>
              {isButton ? (
                <Button 
                  variant="contained" 
                  size="large" 
                  startIcon={< IconComponent/>}
                  href={href}
                  target={target}
                  rel={rel}
                  fullWidth
                >
                  { label || t('actions.press_btn') }
                </Button>
              ) : (
                <Link 
                  href={href} 
                  target={target} 
                  rel={rel} 
                  underline="hover" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: 1,
                  }}
                >
                  {< IconComponent/>} { label || t('actions.open_link') }
                </Link>
              )}
            </Box>
          </CardContent>
        </Card>
      );
    }

    case 'smart_action': {
      return (
        <SmartActionRenderer 
          content={content}
          cardVariant={cardVariant}
          cardStyles={cardStyles}
          renderHeader={renderHeader}
        />
      );
    }

    default:
      return null;
  }
};