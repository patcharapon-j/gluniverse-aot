/**
 * Library build of the system (ADR-0025). src/index.ts becomes dist/wings-of-freedom.mjs; static/
 * (system.json, lang, styles, assets) is copied as-is. data/ is read and validated at build time
 * and baked in through the virtual module "virtual:wof-config".
 */
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { buildConfig } from './tools/config-data.ts';
import { FILES, loadTables, REPO_ROOT } from './tools/data/load.ts';

const VIRTUAL_ID = 'virtual:wof-config';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

function wofConfig(): Plugin {
  return {
    name: 'wof-config',
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : null;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;
      const tables = loadTables(); // throws DataShapeError, which fails the build loudly
      for (const [path] of Object.values(FILES)) this.addWatchFile(resolve(REPO_ROOT, path));
      return `export default ${JSON.stringify(buildConfig(tables))};`;
    },
  };
}

export default defineConfig(({ mode }) => ({
  publicDir: 'static',
  plugins: [svelte(), wofConfig()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: mode === 'development' ? 'inline' : true,
    minify: mode !== 'development',
    target: 'es2023',
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'wings-of-freedom.mjs',
      cssFileName: 'wings-of-freedom',
    },
    rolldownOptions: {
      output: { codeSplitting: false },
    },
  },
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
  },
}));
