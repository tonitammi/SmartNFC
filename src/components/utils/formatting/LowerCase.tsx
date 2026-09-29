export interface LowerCaseProps {
  text: string;
};

export const LowerCase = ({ text } : LowerCaseProps) => {
  return (
    <>
      {text.toLowerCase()}
    </>
  );
};