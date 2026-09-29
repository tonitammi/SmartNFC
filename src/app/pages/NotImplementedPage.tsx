import { Container, Stack, Typography } from '@mui/material';

export const NotImplementedPage = () => {
  return (
    <Container>
      <Stack gap={4} sx={{ py: 6 }}>
        <Typography variant="h3">
          Not Implemented 
        </Typography>
        <Typography variant="body1">
          This feature or page is not implemented
        </Typography>
      </Stack>
    </Container>
  );
};