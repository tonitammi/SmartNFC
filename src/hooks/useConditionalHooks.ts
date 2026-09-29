/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */


export const useConditionalHooks = <T>(
  condition: boolean, 
  functions: [[Function, any[]], [Function, any[]]]
): T => {
  const index = condition ? 0 : 1;
  return functions[index][0](...functions[index][1]);
};