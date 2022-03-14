import { App } from "@vue/runtime-core";
import { Event, HElement, nodeOps } from "./renderer";

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

function onPageLoad(app: App, root: HElement, pageId: string) {
    pages[pageId] = { app, root }
    app.mount(root);
    nodeOps.attachToPage(root, pageId)
}

function onPageUnload(pageId: string) {
    delete pages[pageId];
}

function triggerEvent(
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
    elem.triggerEvent({...event, bubbles: options?.bubbles, stopPropagation() {
        (this as any).bubbles = false;
    }});
}

export const client = {
    onPageLoad,
    onPageUnload,
    triggerEvent
}