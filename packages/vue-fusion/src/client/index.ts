import { $app, App, encodePageUpdates, Event, flushElementsKey, HElement, nodeOps } from "vue-fusion";

declare const clientHost: {
    updatePages(pageUpdates: any[]): void;
};

/**
 * client has 3 API:
 *  client.onPageLoad
 *  client.triggerEvent
 *  client.onPageUnload
 */

const pages: Record<string, {
    app: App,
    root: HElement
}> = {};

export async function onPageLoad(pageId: string, url: string) {
    if (typeof clientHost === 'undefined') {
        throw new Error('missing clientHost from global');
    }
    const { app, router } = $app.create();
    app.provide(flushElementsKey, (elements) => {
        const pageUpdates = encodePageUpdates(elements);
        clientHost.updatePages(pageUpdates);
    })
    if (router) {
        await router.push(url);
    }
    return _onPageLoad(app, nodeOps.createElement('view'), pageId);
}

export function _onPageLoad(app: App, root: HElement, pageId: string) {
    pages[pageId] = { app, root }
    app.mount(root);
    nodeOps.attachToPage(root, pageId);
}

export function onPageUnload(pageId: string) {
    delete pages[pageId];
}

export function triggerEvent(
    pageId: string, elementId: string, event: Omit<Event, 'stopPropagation'>, options?: { bubbles?: boolean, capturePhase?: boolean }
) {
    const page = pages[pageId];
    if (!page) {
        throw new Error(`page not found: ${pageId}`);
    }
    const elem = page.root.getElementById(elementId);
    if (!elem) {
        throw new Error(`element not found: ${elementId}`);
    }
    elem.triggerEvent({
        ...event, bubbles: options?.bubbles, stopPropagation() {
            (this as any).bubbles = false;
        }
    });
}