import { nodeOps, flushElementsKey, createApp, client, encodeNode } from '../../src';
import { createMemoryHistory, createRouter, RouterView } from 'vue-router';
import * as fusion from '../../src';

test('render default', async () => {
    const app = createApp(fusion.defineComponent({
        render() {
            return <RouterView />
        }
    }));
    let toFlush: any;
    app.provide(flushElementsKey, (elements) => {
        toFlush = elements;
    })
    const router = createRouter({
        history: createMemoryHistory(),
        routes: [{
            name: 'all',
            path: '/:all(.*)*',
            component: fusion.defineComponent({
                render() {
                    return 'hello'
                }
            }),
          }]
    })
    app.use(router)
    await router.push('/');
    const root = nodeOps.createElement('view');
    client.onPageLoad(app, root, 'abc');
    await new Promise<void>(resolve => fusion.nextTick(resolve));
    expect(encodeNode(root).children).toEqual([{
        tag: 'fragment',
        id: 'fragment1',
        children: ['hello']
    }]);
})