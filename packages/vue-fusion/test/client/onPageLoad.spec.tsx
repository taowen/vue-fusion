import { nodeOps, flushElementsKey, createApp, client } from '../../src';
import * as vue from '@vue/runtime-core';

test('callback flushElements', async () => {
    const app = createApp(vue.defineComponent({
        render() {
            return 'hello'
        }
    }));
    let toFlush: any;
    app.provide(flushElementsKey, (elements) => {
        toFlush = elements;
    })
    const root = nodeOps.createElement('view');
    client.onPageLoad(app, root, 'abc');
    await new Promise<void>(resolve => vue.nextTick(resolve));
    expect(toFlush).toEqual([root]);
})