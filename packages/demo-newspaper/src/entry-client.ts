import * as fusion from 'vue-fusion';

export function renderPage(pageId: string) {
    console.log('before', new Date().getTime());
    const app = fusion.createApp(fusion.defineComponent({
        render() {
            return 'hello';
        }
    }));
    const root = fusion.nodeOps.createElement('view');
    app.mount(root);
    root.pageId = pageId;
    console.log('after', new Date().getTime());
    return pageId
}