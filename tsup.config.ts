import {defineConfig} from 'tsup';

export default defineConfig({
  entryPoints: ['src/index.ts', 'src/error.ts'],
  format: 'esm',
  dts: true,
  outDir: 'dist',
  clean: true,
});
