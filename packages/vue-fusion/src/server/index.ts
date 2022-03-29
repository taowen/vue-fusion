import express from 'express';
import fs from 'fs';
import path from 'path';
import { serverRender } from '../renderer/serverRender';
import '/index.js'

export async function startServer() {
    const server = express()
    server.use('*.js', async (req, res) => {
        const url = req.originalUrl
        try {
            const content = fs.readFileSync(path.join(__dirname, 'client', url.substring(1)), 'utf-8');
            res.status(200).set({ 'Content-Type': 'text/html' }).end(content);
        } catch (e: any) {
            console.log(e.stack)
            res.status(500).end(e.stack)
        }
    })
    server.use('*', async (req, res) => {
        try {
            const url = req.originalUrl
            const preloaded: Record<string, string> = {};
            for (let script of ['client.js', 'index.js']) {
                preloaded[script] = fs.readFileSync(path.resolve(__dirname, 'client', script), 'utf-8')
            }
            const fragments = await serverRender(url);
            res.status(200).set({ 'Content-Type': 'text/json' }).end(JSON.stringify({ fragments, preloaded }));
        } catch (e: any) {
            console.log(e.stack)
            res.status(500).end(e.stack)
        }
    })
    server.listen(3000, () => {
        console.log('http://localhost:3000')
    });
}

startServer();