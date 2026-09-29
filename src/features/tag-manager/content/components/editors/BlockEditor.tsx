import { useState } from 'react';
import { 
  Box, 
  Button, 
  Stack, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Grid, 
  Card, 
  CardActionArea,
} from '@mui/material';
import { 
  Add as AddIcon,
  TextFields as TextIcon,
  Image as ImageIcon,
  Audiotrack as AudioIcon,
  TouchApp as ActionIcon,
  AutoAwesome as SmartActionIcon,
  VideoLibrary,
  Description,
} from '@mui/icons-material';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { ContentJSON, ContentJSONType } from '../../types';
import { useTranslation } from 'react-i18next';
import { SortableBlock } from './SortableBlock';
import { MediaContentForm } from '../forms/MediaContentForm';
import { ActionForm } from '../forms/ActionForm';
import { SmartActionForm } from '../forms/SmartActionForm';

export interface BlockEditorProps {
  initialData?: ContentJSON;
  onSave: (data: ContentJSONType[]) => void;
};

export const BlockEditor = ({ 
  initialData, 
  onSave = (d) => console.log('onSave', d),
}: BlockEditorProps) => {
  const { t } = useTranslation();

  const BLOCK_TYPES = [
    { id: 'text', label: t('media.text'), icon: <TextIcon /> },
    { id: 'image', label: t('media.image'), icon: <ImageIcon /> },
    { id: 'audio', label: t('media.audio'), icon: <AudioIcon /> },
    { id: 'video', label: t('media.video'), icon: <VideoLibrary /> },
    { id: 'action', label: t('actions.action'), icon: <ActionIcon /> },
    { id: 'document', label: t('media.document'), icon: <Description /> },
    { id: 'smart_action', label: 'SmartAction', icon: <SmartActionIcon /> },
  ] as const;

  const [blocks, setBlocks] = useState<ContentJSONType[]>(
    Array.isArray(initialData) ? 
    initialData 
    : 
    initialData ? [initialData] : []
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ContentJSONType['content_type'] | null>(null);
  const currentBlock = editingIndex !== null ? blocks[editingIndex] : undefined;

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((_, i) => `block-${i}` === active.id);
        const newIndex = items.findIndex((_, i) => `block-${i}` === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleOpenEdit = (index: number | null) => {
    if (index !== null) {
      setEditingIndex(index);
      setSelectedType(blocks[index].content_type);
    } else {
      setEditingIndex(null);
      setSelectedType(null);
    }
    setIsModalOpen(true);
  };

  const handleSaveBlock = (data: ContentJSONType) => {
    const newBlocks = [...blocks];
    if (editingIndex !== null) {
      newBlocks[editingIndex] = data;
    } else {
      newBlocks.push(data);
    }
    setBlocks(newBlocks);
    onSave(newBlocks);
    setIsModalOpen(false);
  };

  const handleDeleteBlock = (index: number) => {
    if (!confirm()) return;
    const updatedBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(updatedBlocks);
    onSave(updatedBlocks);
  };

  return (
    <Box>
      <Stack gap={2} sx={{ mb: 3 }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext 
            items={blocks.map((_, i) => `block-${i}`)} 
            strategy={verticalListSortingStrategy}
          >
            {blocks.map((block, index) => (
              <SortableBlock 
                key={'block' + index}
                id={'block' + index} 
                block={block}
                onEdit={() => { handleOpenEdit(index); setIsModalOpen(true); }} 
                onDelete={() => handleDeleteBlock(index)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </Stack>

      <Button 
        fullWidth 
        variant="outlined" 
        startIcon={<AddIcon />} 
        onClick={() => handleOpenEdit(null)}
        sx={{ borderStyle: 'dashed', py: 2 }}
      >
        {t('content.editor.common.add_new_block', { ns: 'components' })}
      </Button>

      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle>
          {editingIndex !== null ? 'Edit content' : !selectedType ? 'Select type' : 'Add content details'}
        </DialogTitle>
        <DialogContent dividers>

          {!selectedType && editingIndex === null && (
            <Grid container spacing={2} sx={{ py: 2 }}>
              {BLOCK_TYPES.map((bt) => (
                <Grid size={{ xs: 6 }} key={bt.id}>
                  <Card variant="outlined">
                    <CardActionArea sx={{ p: 3, textAlign: 'center' }} onClick={() => setSelectedType(bt.id)}>
                      {bt.icon}
                      <Typography sx={{ mt: 1 }}>{bt.label}</Typography>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {selectedType && (
            <Box>
              {selectedType === 'action' && (
                <ActionForm 
                  initialValue={currentBlock as Extract<ContentJSONType, { content_type: 'action' }>} 
                  onSave={handleSaveBlock} 
                />
              )}
              {selectedType === 'smart_action' && (
                <SmartActionForm 
                  initialValue={currentBlock as Extract<ContentJSONType, { content_type: 'smart_action' }>} 
                  onSave={handleSaveBlock} 
                />
              )}
              { (selectedType === 'text' || selectedType === 'audio' || selectedType === 'document' || 
                selectedType === 'image' || selectedType === 'video') && (
                <MediaContentForm 
                  type={selectedType}
                  title={'Edit'}
                  initialValue={currentBlock as Extract<ContentJSONType, { content_type: typeof selectedType }>}
                  onSave={handleSaveBlock}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>
            { t('cancel') }
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};