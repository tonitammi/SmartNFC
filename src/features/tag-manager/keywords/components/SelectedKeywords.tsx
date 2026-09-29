import type { Dispatch, SetStateAction } from 'react';
import type { Keyword } from '../types';
import { Chip, Stack } from '@mui/material';
import type { PropsOf } from '@emotion/react';
import { useFeedback } from '@/src/hooks/useFeedback';

export type SelectedKeywordsProps = {
  values: Keyword[];
  setValues?: Dispatch<SetStateAction<Keyword[]>>;
  onDelete?: (id: string) => Promise<unknown>;
};

export const SelectedKeywords = ({ values, setValues, onDelete } : SelectedKeywordsProps) => {
  const { createSnackbar } = useFeedback();

  const handleDeleteRejection = (err: unknown, valuesBeforeUpdate: Keyword[]) => {
    const msg = err instanceof Error ? err.message : typeof err === 'string' ? err : JSON.stringify(err);
    
    createSnackbar({
      severity: 'error',
      content: `Error while deleting keyword: ${msg}`,
    });

    if (setValues) {
      setValues(valuesBeforeUpdate);
    }
  };

  const handleDelete = (id: string) => {
    const valuesBeforeUpdate = structuredClone(values);
    const updatedValued = structuredClone(values);
    const index = updatedValued.findIndex((x) => x.id === id);

    if (index < 0) return;
    
    updatedValued.slice(index, 1);
    
    if (onDelete) onDelete(id).catch((err) => {
      handleDeleteRejection(err, valuesBeforeUpdate);
    });

    if (setValues) setValues(updatedValued); 
  };

  const getChipProps = (id: string): PropsOf<typeof Chip> => (
    setValues ? { onDelete: () => handleDelete(id) } : {}
  );

  return (
    <Stack 
      direction="row"
      flexWrap="wrap"
      gap={1}
    >
      {values.map(({id, name}) => (
        <Chip 
          key={id} 
          label={name} 
          variant="outlined"
          {...getChipProps(id)}
        />
      ))}
    </Stack>
  );
};