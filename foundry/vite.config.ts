/**
 * Library build of the system (ADR-0025). src/index.ts becomes dist/wings-of-freedom.mjs; static/
 * (system.json, lang, styles, assets) is copied as-is. data/ is read and validated at build time
 * and baked in through the virtual module "virtual:wof-config".
 */
import { resolve } from 'node:path';
import { defineConfig, type Plugin, type UserConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { buildConfig, sweepConfigText } from './tools/config-data.ts';
import { loadFoundryWording, warnStale, WORDING_FILES } from './tools/data/foundry-wording.ts';
import { FILES, loadTables, REPO_ROOT } from './tools/data/load.ts';
import { loadSiteWording, SITE_SOURCES } from './tools/data/site-wording.ts';

const VIRTUAL_ID = 'virtual:wof-config';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

function wofConfig(): Plugin {
  return {
    name: 'wof-config',
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : null;
    },
    async load(id) {
      if (id !== RESOLVED_ID) return null;
      const tables = loadTables(); // throws DataShapeError, which fails the build loudly
      const wording = loadFoundryWording({ fresh: true });
      warnStale(wording, (msg) => this.warn(msg));
      const config = buildConfig(tables, await loadSiteWording({ fresh: true }), wording);
      // The website's text guard over every sentence a sheet or a card shows from the config.
      sweepConfigText(config, tables);
      for (const path of [...Object.values(FILES).map(([p]) => p), ...SITE_SOURCES, ...Object.values(WORDING_FILES).map(([p]) => p)]) {
        this.addWatchFile(resolve(REPO_ROOT, path));
      }
      return `export default ${JSON.stringify(config)};`;
    },
  };
}

export default defineConfig(({ mode }) => ({
  publicDir: 'static',
  plugins: [svelte(), wofConfig()],
  // The tests import the website's text guard (site/src/lib/player-text.ts); the site's own
  // tsconfig extends Astro's, which is not installed here, so every file uses this package's.
  oxc: { tsconfig: resolve(import.meta.dirname, 'tsconfig.json') } as UserConfig['oxc'],
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
