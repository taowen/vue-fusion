import { App } from '@vue/runtime-core';
import { renderToString  } from 'vue/server-renderer';
import { HElement } from './nodeOps';
import { parseHtml } from './parseHtml';

export async function renderToMpData(input: App<HElement>) {
    return {
        mpData: parseHtml(await renderToString(input))
    };
}