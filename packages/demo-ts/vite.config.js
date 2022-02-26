const vuePlugin = require('@vitejs/plugin-vue')
const vueJsx = require('@vitejs/plugin-vue-jsx')

/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  plugins: [
    vuePlugin(),
    vueJsx(),
    {
      name: 'virtual',
      resolveId(id) {
        if (id === '@motherboard') {
          return 'demo-motherboard'
        }
      },
    }
  ],
  build: {
    minify: false
  }
}
