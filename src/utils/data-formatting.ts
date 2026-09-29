export const handleEmptyStrings = <T>(data: T): T => {
  const cleanedData = { ...data } as Record<string, unknown>;
  
  Object.keys(cleanedData).forEach((key) => {
    if (cleanedData[key] === '') {
      cleanedData[key] = null;
    }
  });
  
  return cleanedData as T; 
};
