import { defineConfig } from 'rollup'

import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

const pkg = require('./package.json');

export default defineConfig({
  // 打包入口
  input: 'src/index.ts',
  output: [
    { file: pkg.main, name: 'MSDK', format: 'umd' },
    { file: pkg.module, format: 'es' }
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e: 'loadsh')
  external: [],
  watch: {
    include: 'src/**'
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files`
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlink webpack, rollup doesn't understand cjs)
    commonjs(),
    nodeResolve({
      browser: true
    }),
  ]
});