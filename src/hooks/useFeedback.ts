import { useFeedbackContext } from '../context/feedback/useFeedbackContext';

export const useFeedback = () => {
  const { createSnackbar } = useFeedbackContext();

  return { createSnackbar };
};