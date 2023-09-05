import path from "path";
import { defineConfig } from "file:///workspace/node_modules/vite/dist/node/index.js";
import react from "file:///workspace/node_modules/@vitejs/plugin-react-swc/index.mjs";
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [svgr(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
