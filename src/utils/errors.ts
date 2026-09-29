export const getErrorMsg = (err: unknown) => {
  return (err as Error).message ? 
    (err as Error).message 
    : 
    typeof err === 'string' ? err : JSON.stringify(err);
};