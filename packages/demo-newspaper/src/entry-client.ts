import * as fusion from 'vue-fusion';
import createApp from './createApp';

export const onPageLoad = (pageId: string) => {
    return fusion.client.onPageLoad(createApp(), fusion.nodeOps.createElement('view'), pageId);
};
export const onPageUnload = fusion.client.onPageUnload;
export const triggerEvent = fusion.client.triggerEvent;
