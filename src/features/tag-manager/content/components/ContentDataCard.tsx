import { Card, CardContent, Typography } from '@mui/material';
import type { ContentJSONType } from '../types';

export interface ContentDataCardProps {
  content: ContentJSONType;
};

export const ContentDataCard = ({ content } : ContentDataCardProps) => {
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="body1">
          Label: {content.label}
        </Typography>
        <Typography variant="body1">
          Type: {content.content_type}
        </Typography>
        
        {content.content_type === 'action' && (
          <>
            <Typography variant="body1">
              Action: {content.action.action_name}
            </Typography>

            {(content.action.action_name === 'call' || 
              content.action.action_name === 'sms' || 
              content.action.action_name === 'whatsapp') && (
                <Typography variant="body1">
                  Tel: {content.action.tel}
                </Typography>
              )
            }

            {content.action.action_name === 'redirect' && (
              <Typography variant="body1">
                Tel: {content.action.url}
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>  
  );
};