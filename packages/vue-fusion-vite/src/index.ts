import { App } from '@vue/runtime-core';
import { encodeNode, HElement } from 'vue-fusion';
import { extractScripts } from './serverRender/extractScripts';
import { parseHtml } from './serverRender/parseHtml';

/**
 * server only has 1 API
 */
export async function serverRender(app: App<HElement>, indexHtml: string) {
    const { renderToString } = await import('vue/server-renderer');
    const renderedHtml = await renderToString(app);
    const node = parseHtml(renderedHtml);
    const fragments = encodeNode(node).children;
    const scripts = extractScripts(indexHtml);
    return {
        fragments,
        scripts
    };
}