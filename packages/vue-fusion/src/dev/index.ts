import express from 'express';
import fs from 'fs';
import path from 'path';

async function main() {
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
            const { serverRender, extractScripts } = (await vite.ssrLoadModule('vue-fusion/server'))
            const scripts = extractScripts(fs.readFileSync(path.resolve(root, 'index.html'), 'utf-8'));
            const fragments = await serverRender(url);
            const result = '<html>' + scripts.map((s: string) => `<script src="${s}"/>`).join('') + '</html>' + JSON.stringify({ fragments, scripts })
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

main();