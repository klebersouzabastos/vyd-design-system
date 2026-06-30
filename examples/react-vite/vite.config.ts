import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// @vyd/react ships as TSX source; Vite transpiles the linked workspace package
// on the fly. @vyd/design-system is consumed only as CSS (subpath exports).
export default defineConfig({
  plugins: [react()],
});
