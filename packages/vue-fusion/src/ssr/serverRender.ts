import { Fragment, isVNode } from 'vue';
import { $app, encodeNode, nodeOps } from 'vue-fusion';

export async function serverRender(url: string) {
    const { app, router } = $app.create();
    if (router) {
        await router.push(url);
    }
    const root = nodeOps.createElement('div');
    const instance = app.mount(root);
    await waitForServerPrefetch(instance.$.vnode);
    return encodeNode(root).children;
}

async function waitForServerPrefetch(vnode: any): Promise<void> {
    if (!vnode) {
        return;
    }
    if (!isVNode(vnode)) {
        return;
    }
    if (vnode.type === Fragment) {
        if (Array.isArray(vnode.children)) {
            // hydrate will need these comments to restore <Fragment />
            const firstNode = (vnode.children[0] as any).el;
            const firstNodeParent = firstNode.parentNode;
            const firstNodePos = firstNodeParent.children.indexOf(firstNode);
            firstNodeParent.children.splice(firstNodePos, 0, nodeOps.createComment('['))
            const lastNode = (vnode.children[vnode.children.length - 1] as any).el;
            const lastNodeParent = lastNode.parentNode;
            const lastNodePos = lastNodeParent.children.indexOf(lastNode);
            lastNodeParent.children.splice(lastNodePos + 1, 0, nodeOps.createComment(']'))
            for (const child of vnode.children) {
                await waitForServerPrefetch(child)
            }
        }
        return;
    }
    if (vnode.component) {
        if ((vnode.component as any).sp) {
            for (const serverPrefetch of (vnode.component as any).sp) {
                await serverPrefetch()
            }
        }
        return await waitForServerPrefetch(vnode.component.subTree);
    }
    if (Array.isArray(vnode.children)) {
        for (const child of vnode.children) {
            await waitForServerPrefetch(child)
        }
    }
}