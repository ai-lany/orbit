import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Design-system tokens, reset, fonts, and component styles — imported once.
import '@your-org/design-system/dist/index.css';
import './styles/app.css';

import { App } from './App';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

// Matches Vite's `base` so routing works under the GitHub Pages subpath (/orbit/)
// in production and at "/" during local dev.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

createRoot(container).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
