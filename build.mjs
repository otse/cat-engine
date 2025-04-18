// build.mjs
import { build } from 'esbuild';

build({
  entryPoints: ['src/index.ts'],  // your entry point
  outfile: 'dist/worldetch.js',
  bundle: true,
  minify: false,
  sourcemap: false,
  target: ['es2020'],
  format: 'iife', // "immediately-invoked function expression" for browser use
  globalName: 'worldetch', // this becomes window.worldetch
}).catch(() => process.exit(1));