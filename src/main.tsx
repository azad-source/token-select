import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './main.scss';
import { ThemeContext } from '@skbkontur/react-ui';
import theme from './theme.ts';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeContext.Provider value={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeContext.Provider>
  </StrictMode>
);
