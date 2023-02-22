import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./lib/index.js'],
  dts: true,
  clean: true,
  format: 'esm',
  minify: true,
})
