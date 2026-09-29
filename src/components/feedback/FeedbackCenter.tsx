import { useFeedbackContext } from '@/src/context/feedback/useFeedbackContext';
import { Portal } from '@mui/material';
import { FeedbackSnackbar } from './snackbar/FeedbackSnackbar';

const snackbarHeight = 50;
const marginBottom = 12;

export const FeedbackCenter = () => {
  const { snackbars, removeSnackbar } = useFeedbackContext();

  return (
    <Portal>
      { snackbars.map((opts, i) => (
        <FeedbackSnackbar 
          key={opts.id} 
          removeSnackbar={removeSnackbar} 
          sx={{
            mb: `${snackbarHeight * i + marginBottom}px`,
          }}
          {...opts} 
        />
      )) }
    </Portal>
  );
};