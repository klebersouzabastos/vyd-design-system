import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Consume the VYD design system: tokens + primitives, then the app-shell layout.
import '@vyd/design-system/theme.css';
import '@vyd/design-system/shell.css';

import { AppShellScene } from './AppShellScene';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppShellScene />
  </StrictMode>,
);
