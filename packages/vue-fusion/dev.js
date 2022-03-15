const express = require('express');
const fs = require('fs');
const path = require('path');

module.exports.startDevServer = async function startDevServer(entry) {
    const root = process.cwd();
    const server = express()
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
    server.use(vite.middlewares)
    server.use('*', async (req, res) => {
        try {
            const url = req.originalUrl
            await vite.ssrLoadModule(entry);
            const { serverRender, extractScripts } = (await vite.ssrLoadModule('vue-fusion/server'))
            const scripts = extractScripts(fs.readFileSync(path.resolve(root, 'index.html'), 'utf-8'));
            const fragments = await serverRender(url);
            const result = '<html>' + scripts.map(s => `<script src="${s}"/>`).join('') + '</html>' + JSON.stringify({ fragments, scripts })
            res.status(200).set({ 'Content-Type': 'text/html' }).end(result);
        } catch (e) {
            vite && vite.ssrFixStacktrace(e)
            console.log(e.stack)
            res.status(500).end(e.stack)
        }
    })
    server.listen(3000, () => {
        console.log('http://localhost:3000')
    });
}