import * as fusion from '../src';

test('trigger direct element', async () => {
    let called = false;
    const app = fusion.createApp(fusion.defineComponent({
        render() {
            return <div onClick={() => {
                called = true;
            }}>hello</div>
        }
    }));
    const root = fusion.nodeOps.createElement('view');
    fusion.onPageLoad(app, root, 'abc');
    fusion.triggerEvent('abc', (root.children[0] as any).id, { type: 'click' });
    expect(called).toBeTruthy()
})