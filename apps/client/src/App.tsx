import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { shadcnTheme } from "./theme";
import { shadcnCssVariableResolver } from './cssVariableResolver';
import "./styles.css";

import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { AuthProvider } from './context/AuthContext';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

// React Query imports
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={shadcnTheme} defaultColorScheme="light" cssVariablesResolver={shadcnCssVariableResolver}>
        <Notifications position="bottom-right" zIndex={1000} />
        <ModalsProvider>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </ModalsProvider>
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
