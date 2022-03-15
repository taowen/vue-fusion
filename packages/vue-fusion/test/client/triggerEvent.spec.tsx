import { nodeOps, flushElementsKey, createApp, client, Event } from '../../src';
import * as fusion from '../../src';

test('trigger direct element', async () => {
    let called = false;
    const app = createApp(fusion.defineComponent({
        render() {
            return <div onClick={() => {
                called = true;
            }}>hello</div>
        }
    }));
    const root = nodeOps.createElement('view');
    client.onPageLoad(app, root, 'abc');
    client.triggerEvent('abc', (root.children[0] as any).id, { type: 'click' });
    expect(called).toBeTruthy()
})

test('bubbles', async () => {
    let called = false;
    const Comp = fusion.defineComponent({
        render() {
            return <span>hello</span>
        }
    })
    const app = createApp(fusion.defineComponent({
        render() {
            return <div onClick={() => {
                called = true;
            }}><Comp /></div>
        }
    }));
    const root = nodeOps.createElement('view');
    client.onPageLoad(app, root, 'abc');
    client.triggerEvent('abc', (root.children[0] as any).children[0].id, { type: 'click' }, { bubbles: true });
    expect(called).toBeTruthy()
})

test('stopPropagation', async () => {
    let called = false;
    const Comp = fusion.defineComponent({
        render() {
            return <span onClick={(e: Event) => {
                e.stopPropagation();
            }}>hello</span>
        }
    })
    const app = createApp(fusion.defineComponent({
        render() {
            return <div onClick={() => {
                called = true;
            }}><Comp /></div>
        }
    }));
    const root = nodeOps.createElement('view');
    client.onPageLoad(app, root, 'abc');
    client.triggerEvent('abc', (root.children[0] as any).children[0].id, { type: 'click' }, { bubbles: true });
    expect(called).toBeFalsy()
})

test('trigger re-render', async () => {
    const app = createApp(fusion.defineComponent({
        data() {
            return {
                msg: 'hello'
            }
        },
        render() {
            return <div onClick={() => {
                this.msg = 'world';
            }}>{ this.msg }</div>
        }
    }));
    const root = nodeOps.createElement('view');
    let renderCount = 0;
    app.provide(flushElementsKey, (elements) => {
        renderCount++;
    })
    client.onPageLoad(app, root, 'abc');
    await new Promise<void>(resolve => fusion.nextTick(resolve));
    expect(renderCount).toBe(1);
    client.triggerEvent('abc', (root.children[0] as any).id, { type: 'click' });
    await new Promise<void>(resolve => fusion.nextTick(resolve));
    expect(renderCount).toBe(2);
})