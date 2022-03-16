import { defineConfig } from 'vite';
import PagesPlugin from 'vite-plugin-pages';

export default defineConfig({
  logLevel: 'info',
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false
  },
  plugins: [
    PagesPlugin({
      extensions: ['tsx']
    }),
  ],
  build: {
    minify: false
  },
})