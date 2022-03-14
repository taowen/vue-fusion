import * as fusion from 'vue-fusion';
import createApp from './createApp';

declare const clientHost: any;

if (!clientHost) {
    throw new Error('missing clientHost from global');
}

export const onPageLoad = (pageId: string) => {
    const app = createApp();
    app.provide(fusion.flushElementsKey, (elements) => {
        clientHost.setMpData(fusion.encodePage(elements));
    })
    return fusion.client.onPageLoad(app, fusion.nodeOps.createElement('view'), pageId);
};
export const onPageUnload = fusion.client.onPageUnload;
export const triggerEvent = fusion.client.triggerEvent;
