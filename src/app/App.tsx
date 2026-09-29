import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router';
import { AuthContextProvider } from '../features/auth/context/AuthContextProvider.tsx';
import { linkThemeOptions } from '../components/inputs/links/linkThemeOptions.ts';
import { OrganizationContextProvider } from '../features/organization/context/OrganizationContextProvider.tsx';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // DEV
import { AppRoutes } from './routes/AppRoutes.tsx';
import { FeedbackContextProvider } from '../context/feedback/FeedbackContextProvider.tsx';
import { FeedbackCenter } from '../components/feedback/FeedbackCenter.tsx';
import { config } from '../config/config.ts';
import { AppContextProvider } from '../context/app/AppContextProvider.tsx';

const queryClient = new QueryClient();

const theme = createTheme({
  colorSchemes: {
    dark: true,
    light: true,
  },
  components: {
    ...linkThemeOptions,
  },
});

function App() {
  return (
    <>
      <AppContextProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <FeedbackContextProvider>

              <BrowserRouter>
                <AuthContextProvider>
                  <OrganizationContextProvider>
                    <AppRoutes />
                  </OrganizationContextProvider>
                </AuthContextProvider>
              </BrowserRouter>
              
              <FeedbackCenter />

            </FeedbackContextProvider>
          </ThemeProvider>
          
          {/* for dev use */}
          { !config.isProduction && (
            <ReactQueryDevtools initialIsOpen={false} />
          ) }
          {/* for dev use ends */}
        </QueryClientProvider>
      </AppContextProvider>
    </>
  );
}

export default App;
