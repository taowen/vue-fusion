import { App } from '@vue/runtime-core';
import { renderToString  } from 'vue/server-renderer';
import { encodeNode, HElement } from './renderer';
import { extractScripts } from './serverRender/extractScripts';
import { parseHtml } from './serverRender/parseHtml';

/**
 * server only has 1 API
 */
export async function serverRender(app: App<HElement>, indexHtml: string) {
    const renderedHtml = await renderToString(app);
    const node = parseHtml(renderedHtml);
    const fragments = encodeNode(node);
    const scripts = extractScripts(indexHtml);
    return {
        fragments,
        scripts
    };
}