const path = require('path')
const fs = require('fs');
const express = require('express')
const vuePlugin = require('@vitejs/plugin-vue')
const vueJsx = require('@vitejs/plugin-vue-jsx')

async function createServer(
) {
  const app = express()

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite
  vite = await require('vite').createServer({
    root: __dirname,
    logLevel: 'info',
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

      const createApp = (await vite.ssrLoadModule('/src/createApp.tsx')).default
      const fusion = (await vite.ssrLoadModule('vue-fusion'));
      const { fragments, scripts } = await fusion.serverRender(createApp(), fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8'));
      const result = '<html>' + scripts.map(s => `<script src="${s}"/>`).join('') + '</html>' + JSON.stringify({ fragments })
      res.status(200).set({ 'Content-Type': 'text/html' }).end(result);
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