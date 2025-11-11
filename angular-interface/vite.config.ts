import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    hmr: {
      overlay: false
    },
    host: 'localhost',
    port: 4200
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suprimir avisos específicos do Vite
        if (warning.code === 'UNRESOLVED_IMPORT') return;
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        warn(warning);
      }
    }
  },
  optimizeDeps: {
    include: [
      '@angular/core',
      '@angular/common',
      '@angular/platform-browser',
      '@angular/router'
    ]
  }
});