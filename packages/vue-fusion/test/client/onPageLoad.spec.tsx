import { _onPageLoad } from '../../src/client';
import * as fusion from '../../src/renderer';

test('callback flushElements', async () => {
    const app = fusion.createApp(fusion.defineComponent({
        render() {
            return 'hello'
        }
    }));
    let toFlush: any;
    app.provide(fusion.flushElementsKey, (elements) => {
        toFlush = elements;
    })
    const root = fusion.nodeOps.createElement('view');
    _onPageLoad(app, root, 'abc');
    await new Promise<void>(resolve => fusion.nextTick(resolve));
    expect(toFlush).toEqual([root]);
})