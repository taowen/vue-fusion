import * as fusion from 'vue-fusion';
import createApp from './createApp';

declare const clientHost: any;

if (!clientHost) {
    throw new Error('missing clientHost from global');
}

export const onPageLoad = (pageId: string) => {
    const app = createApp();
    app.provide(fusion.flushElementsKey, (elements) => {
        const pageUpdates = fusion.encodePageUpdates(elements);
        clientHost.updatePages(pageUpdates);
    })
    return fusion.client.onPageLoad(app, fusion.nodeOps.createElement('view'), pageId);
};
export const onPageUnload = fusion.client.onPageUnload;
export const triggerEvent = fusion.client.triggerEvent;
