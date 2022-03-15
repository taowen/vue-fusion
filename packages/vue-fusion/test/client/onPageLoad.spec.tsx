import { nodeOps, flushElementsKey, createApp, client } from '../../src';
import * as fusion from '../../src';

test('callback flushElements', async () => {
    const app = createApp(fusion.defineComponent({
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
    await new Promise<void>(resolve => fusion.nextTick(resolve));
    expect(toFlush).toEqual([root]);
})