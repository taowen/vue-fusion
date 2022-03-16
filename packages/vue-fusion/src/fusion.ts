import cac from 'cac';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { build as viteBuild, createServer as createViteServer } from 'vite';
import { packDir } from './packDir';

const root = process.cwd();
if (!fs.existsSync(path.join(root, 'vite.config.ts'))) {
    console.error(`missing ${path.join(root, 'vite.config.ts')}`)
    process.exit(1);
}
const cli = cac();

cli.command('dev', 'start development server').action(async () => {
    const server = express()
    const vite = await createViteServer({
        root,
        build: {
            rollupOptions: {
                input: {
                    main: path.resolve(root, 'index.js')
                }
            },
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
    server.use(vite.middlewares)
    server.use('*', async (req, res) => {
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
    server.listen(3000, () => {
        console.log('http://localhost:3000')
    });
})

cli.command('build-server', 'build production server').action(async () => {
    await viteBuild({
        root,
        ssr: {
            noExternal: /./
        },
        build: {
            ssr: 'server',
            rollupOptions: {
                input: {
                    server: 'vue-fusion/server'
                }
            },
            outDir: path.resolve(root, 'dist'),
        },
    } as any)
    await viteBuild({
        root,
        build: {
            lib: {
                entry: path.resolve(root, 'index.js'),
                formats: ['es'],
                fileName: () => 'client.js'
            },
            outDir: path.resolve(root, 'dist/client'),
            rollupOptions: {
                output: {
                    chunkFileNames: (chunk) => {
                        return `${chunk.name.replace(/\./g, '').replace(/_/g, '')}.js`;
                    }
                }
            }
        },
    })
    const preloaded: Record<string, string> = {};
    for (let script of ['client.js', 'index.js']) {
        preloaded[script] = fs.readFileSync(path.resolve(root, 'dist/client', script), 'utf-8')
    }
    fs.writeFileSync(path.join(root, 'dist/client/index.html'), JSON.stringify({
        preloaded
    }))
});

cli.command('build-weapp', 'build production wechat miniprogram').action(async () => {
    packDir(path.resolve(root, 'dist/client'));
})

cli.help();
cli.parse();