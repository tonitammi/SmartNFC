import type { ReactNode } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { ErrorAlert } from '../feedback/ErrorAlert';
import { Button } from '@mui/material';
 
function FallbackComponent({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <ErrorAlert error={error} />
      <Button onClick={resetErrorBoundary}>Retry</Button>
    </div>
  );
}
 
export type AppErrorBoundaryProps = {
  children: ReactNode | ReactNode[]; 
};

export const AppErrorBoundary = ({ children } : AppErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      FallbackComponent={FallbackComponent}
    >
      {children}
    </ErrorBoundary>
  );
};

