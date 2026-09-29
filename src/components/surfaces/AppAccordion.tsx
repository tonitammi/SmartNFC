import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useMemo, type ReactNode } from 'react';

export interface AppAccordionProps {
  title: string | ReactNode;
  defaultExpanded?: boolean;
  children: ReactNode | null;
};

export default function AppAccordion({ title, defaultExpanded = false, children } : AppAccordionProps) {
  const elemId = useMemo(() => {
    return title + window.crypto.randomUUID();
  }, [title]);
  return (
    <Accordion defaultExpanded={defaultExpanded}>
      <AccordionSummary
        expandIcon={<ArrowDownwardIcon />}
        aria-controls={`${elemId}-content`}
        id={`${elemId}-header`}
        
      >
        <Typography component="span">
          { title }
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        { children }
      </AccordionDetails>
    </Accordion>
  );
};