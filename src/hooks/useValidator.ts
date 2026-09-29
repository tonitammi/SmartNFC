import { useState } from 'react';
import type { output, ZodError, ZodObject } from 'zod';

export const useValidator = <T extends ZodObject>(schema: T) => {
  const [error, setError] = useState<ZodError<output<T>> | null>(null);
  const [data, setData] = useState<typeof schema.shape | null>(null);

  const validate = (data: unknown) => {
    setError(null);
    setData(null);

    const result = schema.safeParse(data);

    if (result.success) {
      setData(result.data);
      return true;
    };

    setError(result.error);
    return false;
  };

  return { validate, error, data };
};