import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Design-system tokens, reset, fonts, and component styles — imported once.
import '@your-org/design-system/dist/index.css';
import './styles/app.css';

import { App } from './App';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
