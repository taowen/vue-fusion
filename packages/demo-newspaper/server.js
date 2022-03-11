const path = require('path')
const express = require('express')
const fusion = require('vue-fusion');
const vuePlugin = require('@vitejs/plugin-vue')
const vueJsx = require('@vitejs/plugin-vue-jsx')

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD

async function createServer(
  isProd = process.env.NODE_ENV === 'production'
) {
  const resolve = (p) => path.resolve(__dirname, p)

  const manifest = isProd
    ? // @ts-ignore
      require('./dist/client/ssr-manifest.json')
    : {}

  const app = express()

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite
    vite = await require('vite').createServer({
      root: __dirname,
      logLevel: isTest ? 'error' : 'info',
      plugins: [
        vuePlugin(),
        vueJsx(),
      ],
      build: {
        minify: false
      },
      server: {
        middlewareMode: 'ssr',
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100
        }
      }
    })
    // use vite's connect instance as middleware
    app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl

      let render
        // always read fresh template in dev
        render = (await vite.ssrLoadModule('/src/entry-server.ts')).render

      const renderResult = await render(url, manifest)
      const page = fusion.servePage(renderResult, resolve('index.html'))

      res.status(200).set({ 'Content-Type': 'text/html' }).end(page)
    } catch (e) {
      vite && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

  return { app, vite }
}

  createServer().then(({ app }) =>
    app.listen(3000, () => {
      console.log('http://localhost:3000')
    })
  )