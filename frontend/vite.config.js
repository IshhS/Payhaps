import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    // SPA fallback: serve index.html for all routes (needed for /set-password)
    historyApiFallback: true,
  },
  // Vite uses appType 'spa' by default, which enables history fallback
  appType: 'spa',
});
