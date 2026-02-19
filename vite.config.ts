import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    build: {
      target: 'es2015',
      minify: 'terser',
      terserOptions: {
        compress: { drop_console: true, passes: 2 }
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('react-router') || id.includes('react-dom') || id.includes('react/')) return 'vendor';
            if (id.includes('framer-motion')) return 'framer';
            if (id.includes('marked')) return 'marked';
          }
        }
      }
    }
  };
});
