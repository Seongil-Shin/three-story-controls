import typescript from '@rollup/plugin-typescript'
import eslint from '@rbnlffl/rollup-plugin-eslint'
import { terser } from 'rollup-plugin-terser'
import postcss from 'rollup-plugin-postcss'
import nested from 'postcss-nested'

const input = 'src/index.ts'
const name = 'ThreeStoryControls'
const sourcemap = true

const commonPlugins = () => {
  const plugins = [
    eslint(),
    typescript(),
    postcss({
      extensions: ['.css'],
      plugins: [nested()],
    }),
  ]
  if (process.env.NODE_ENV === 'production') {
    plugins.push(terser())
  }
  return plugins
}

const umdConfig = {
  input,
  output: {
    file: `dist/three-story-controls${process.env.NODE_ENV == 'production' ? '.min' : ''}.js`,
    format: 'umd',
    name,
    sourcemap,
    globals: {
      three: 'THREE',
      gsap: 'gsap',
    },
  },
  external: ['three', 'gsap'],
  plugins: [...commonPlugins()],
}

const esmConfig = {
  input,
  output: {
    file: `dist/three-story-controls.esm${process.env.NODE_ENV == 'production' ? '.min' : ''}.js`,
    format: 'es',
    name,
    sourcemap,
  },
  external: ['three', 'gsap'],
  plugins: [...commonPlugins()],
}

const config = [umdConfig, esmConfig]

// if (NODE_ENV === 'production') {
//   config.push(umdConfig)
// }

export default config
