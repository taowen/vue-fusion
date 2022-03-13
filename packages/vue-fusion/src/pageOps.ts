import { App } from "@vue/runtime-core";
import { Event, HElement, nodeOps } from "./nodeOps";

const pages: Record<string, {
    app: App,
    root: HElement
}> = {};

export function onPageLoad(app: App, root: HElement, pageId: string) {
    pages[pageId] = { app, root }
    app.mount(root);
    nodeOps.attachToPage(root, pageId)
}

export function onPageUnload(pageId: string) {
    delete pages[pageId];
}

export function triggerEvent(
    pageId: string, elementId: string, event: Event, options?: { bubbles?: boolean, capturePhase?: boolean }
) {
    const page = pages[pageId];
    if (!page) {
        throw new Error(`page not found: ${pageId}`);
    }
    const elem = page.root.getElementById(elementId);
    if (!elem) {
        throw new Error(`element not found: ${elementId}`);
    }
    elem.triggerEvent(event, options);
}