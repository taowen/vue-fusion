import { App } from "@vue/runtime-core";
import { HElement, nodeOps } from "./nodeOps";

export function onPageLoad(app: App, root: HElement, pageId: string) {
    app.mount(root);
    nodeOps.attachToPage(root, pageId)
}