import express from 'express';

export async function startDevServer() {
    const root = process.cwd();
    const app = express()
    const vite = await require('vite').createServer({
        root,
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
    app.use(vite.middlewares)
    app.use('*', async (req, res) => {
        try {
            const url = req.originalUrl
            await vite.ssrLoadModule('index.js');
            const { serverRender } = (await vite.ssrLoadModule('vue-fusion/ssr'))
            const fragments = await serverRender(url);
            const result = '<html><script src="index.js"/></html>' + JSON.stringify({ fragments, scripts: ['index.js'] })
            res.status(200).set({ 'Content-Type': 'text/html' }).end(result);
        } catch (e: any) {
            vite && vite.ssrFixStacktrace(e)
            console.log(e.stack)
            res.status(500).end(e.stack)
        }
    })
    app.listen(3000, () => {
        console.log('http://localhost:3000')
    });
}