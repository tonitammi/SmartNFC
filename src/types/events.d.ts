import type { ChangeEvent } from 'react';

export type SelectChangeEvent<T = string> = ChangeEvent<HTMLInputElement, Element> 
  | (Event & {
      target: {
        value: null;
        name: string;
      };
    }) 
  | ChangeEvent<Omit<HTMLInputElement, 'value'> & {
      value: T;
    }, Element> 
  | (Event & {
      target: {
        value: T;
        name: string;
      };
    });