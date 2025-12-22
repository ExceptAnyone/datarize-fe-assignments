import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, Global } from '@emotion/react';
import App from './App.tsx';
import { queryClient } from './lib/react-query/queryClient';
import { theme } from './styles/theme';
import { globalStyles } from './styles/globalStyles';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Global styles={globalStyles} />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
