import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Paper, IconButton, Typography } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import type { ContentJSONType } from '../../types';

export interface SortableBlockProps {
  id: string, 
  block: ContentJSONType, 
  onEdit: () => void, 
  onDelete: () => void,
}

export const SortableBlock = ({ id, block, onEdit, onDelete }: SortableBlockProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  return (
    <Paper
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}
    >
      <Box {...attributes} {...listeners} sx={{ cursor: 'grab', color: 'text.disabled' }}>
        ⠿
      </Box>
      {block.content_type === 'image' && 'url' in block && (
        <Box 
          component="img"
          src={block.url}
          sx={{
            width: 80,
            height: 80,
            objectFit: 'cover',
          }}
        />
      )}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" sx={{ display: 'block' }}>
          {block.content_type}
          {block.content_type === 'action' && ` (${block.action.action_name})`}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {block.label || 'Nimetön lohko'}
        </Typography>
      </Box>
      <IconButton onClick={onEdit} size="small">
        <EditIcon />
      </IconButton>
      <IconButton onClick={onDelete} size="small" color="error">
        <DeleteIcon />
      </IconButton>
    </Paper>
  );
};