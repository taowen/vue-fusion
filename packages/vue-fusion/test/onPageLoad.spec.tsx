import * as fusion from '../src';

test('callback flushElements', async () => {
    const app = fusion.createApp(fusion.defineComponent({
        render() {
            return 'hello'
        }
    }));
    let toFlush: any;
    app.provide(fusion.nodeOps.flushElementsKey, (elements) => {
        toFlush = elements;
    })
    const root = fusion.nodeOps.createElement('view');
    fusion.onPageLoad(app, root, 'abc');
    await new Promise<void>(resolve => fusion.nextTick(resolve));
    expect(toFlush).toEqual([root]);
})