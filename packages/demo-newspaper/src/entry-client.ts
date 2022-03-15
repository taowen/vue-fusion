import * as fusion from 'vue-fusion';
import { client } from 'vue-fusion/client';
import createApp from './createApp';

declare const clientHost: {
    updatePages(pageUpdates: any[]): void;
};

if (!clientHost) {
    throw new Error('missing clientHost from global');
}

export const onPageLoad = async (pageId: string, url: string) => {
    const { app, router } = createApp();
    app.provide(fusion.flushElementsKey, (elements) => {
        const pageUpdates = fusion.encodePageUpdates(elements);
        clientHost.updatePages(pageUpdates);
    })
    await router.push(url);
    return client.onPageLoad(app, fusion.nodeOps.createElement('view'), pageId);
};
export const onPageUnload = client.onPageUnload;
export const triggerEvent = client.triggerEvent;
