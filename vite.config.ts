//@ts-nocheck
declare global {
  const Salla: any;
}
import { defineConfig } from 'vite';
import {
  sallaBuildPlugin,
  sallaDemoPlugin,
  sallaTransformPlugin,
} from '@salla.sa/twilight-bundles/vite-plugins';

// Local preview only: some Windows setups request "/@fsC:/..." instead of "/@fs/C:/...".
// This puts the missing slash back so the dev server can find the files.
const fixWindowsFsPath = () => ({
  name: 'fix-windows-fs-path',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url && /^\/@fs[A-Za-z]:/.test(req.url)) {
        req.url = req.url.replace(/^\/@fs([A-Za-z]:)/, '/@fs/$1');
      }
      next();
    });
  },
});

export default defineConfig({
  plugins: [
    fixWindowsFsPath(),
    sallaTransformPlugin(),
    sallaBuildPlugin(),
    sallaDemoPlugin({}),
  ],
});
