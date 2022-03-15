import { App } from '@vue/runtime-core';
import { encodeNode, HElement } from 'vue-fusion';
import { extractScripts } from './extractScripts';
import { parseHtml } from './parseHtml';
import { renderToString } from 'vue/server-renderer';

export async function serverRender(app: App<HElement>, indexHtml: string) {
    const renderedHtml = await renderToString(app);
    const node = parseHtml(renderedHtml);
    const fragments = encodeNode(node).children;
    const scripts = extractScripts(indexHtml);
    return {
        fragments,
        scripts
    };
}