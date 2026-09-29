import { useMemo } from 'react';

export interface CapitalizedProps {
  text: string;
};

export const Capitalized = ({ text } : CapitalizedProps) => {
  const formattedText = useMemo(() => {
    const firstLetter = text[0];
    const restLetters = text.substring(1);

    return `${firstLetter.toUpperCase()}${restLetters}`;
  }, [text]);

  return (
    <>{formattedText}</>
  );
};