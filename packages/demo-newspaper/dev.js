const path = require('path')
const fs = require('fs');
const express = require('express')
const PagesPlugin = require('vite-plugin-pages').default

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
      PagesPlugin({
        extensions: ['tsx']
      })
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
  await vite.restart(true);
  // use vite's connect instance as middleware
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl

      const createApp = (await vite.ssrLoadModule('/src/createApp.tsx')).default
      const app = createApp().app;
      const fusion = (await vite.ssrLoadModule('vue-fusion-vite'));
      const { fragments, scripts } = await fusion.serverRender(app, fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8'));
      const result = '<html>' + scripts.map(s => `<script src="${s}"/>`).join('') + '</html>' + JSON.stringify({ fragments: [], scripts })
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