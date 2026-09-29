import { Stack } from '@mui/material';
import { ThemeToggle } from '../utils/ThemeToggle';
import { LanguageToggle } from '../utils/LanguageToggle';

export const BasicAppBar = () => {
  return (
    <Stack 
      flexDirection="row"
      justifyContent="flex-end"
      alignItems="center"
      gap={3}
      sx={{ my: '.5rem', mr: '.5rem' }}
    >
      <ThemeToggle />
      <LanguageToggle />
    </Stack>
  );
};