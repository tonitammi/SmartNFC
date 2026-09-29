export const toISOString = (value: number | string | Date = new Date()) => {
  const date = new Date(value);
  return date.toISOString();
};