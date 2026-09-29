import { useContext } from 'react';
import { FeedbackContext, type FeedbackContextValue } from './FeedbackContext';

export const useFeedbackContext = (): FeedbackContextValue => {
  const feedbackContext = useContext(FeedbackContext);

  if (!feedbackContext) {
    throw Error('useFeedbackContext and useFeedback custom hook must be used within an FeedbackContextProvider');
  };

  return feedbackContext;
};