import { Stack, Typography } from '@mui/material';
import { ContentRenderer } from './ContentRenderer';
import type { ContentEntry } from '../types';

export type ContentEntryProps = {
  content: ContentEntry;
};

export const ContentEntryBlock = ({ content }: ContentEntryProps) => {
  return (
    <>
      <Typography variant="h4" sx={{ marginBottom: '2rem', marginTop: '1rem' }}>
        {content?.title}
      </Typography>
      <Stack gap={4}>
        {content?.content_data && (
          (Array.isArray(content?.content_data) ? 
            content.content_data 
            : 
            [content.content_data])
            .map((contentEntry, i) => (
              <ContentRenderer 
                key={content.id + '_content_entry_' + i}
                content={contentEntry} 
              />
            )
          )
        )}
      </Stack>
    </>
  );
};