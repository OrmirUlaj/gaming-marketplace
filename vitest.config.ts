import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    alias: {
      '@/': '/src/',
    },
    css: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // Add esbuild configuration for JSX
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
});