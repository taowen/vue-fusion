import { $app, encodeNode } from 'vue-fusion';
import { parseHtml } from './parseHtml';
import { renderToString } from 'vue/server-renderer';

export async function serverRender(url: string) {
    const { app, router } = $app.create();
    await router.push(url);
    const renderedHtml = await renderToString(app);
    const node = parseHtml(renderedHtml);
    return encodeNode(node).children;
}