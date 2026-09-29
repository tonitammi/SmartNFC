export interface UpperCaseProps {
  text: string;
};

export const UpperCase = ({ text } : UpperCaseProps) => {
  return (
    <>
      {text.toUpperCase()}
    </>
  );
};