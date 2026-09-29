import { useMemo } from 'react';

export interface DateFormatProps {
  date: ConstructorParameters<typeof Date>[number] | null;
  format?: 'localTime' | 'localDate' | 'localDateTime';
};


export const DateFormat = ({ date, format = 'localDate' } : DateFormatProps) => {
  const formattedText = useMemo(() => {
    if (!date) return '';
    const d = new Date(date);
    if (format === 'localTime') return d.toLocaleTimeString();
    if (format === 'localDateTime') return d.toLocaleString();
    return d.toLocaleDateString();
  }, [date, format]);

  return (
    <>{formattedText}</>
  );
};