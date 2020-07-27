import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import html from '@rollup/plugin-html';

const devConfig = {
  input: 'src/Demo.ts',
  output: {
    dir: 'build',
    format: 'esm'
  },
  plugins: [
    typescript({noEmitOnError:false, declaration:false, outDir: 'build'}),
    nodeResolve(),
    html({ title: 'GaugeChart' }),
  ]
};

const buildConfig = {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    typescript(),
    nodeResolve(),
  ]
};

const config = process.env.DEVELOPMENT ? devConfig : buildConfig;

export default config;