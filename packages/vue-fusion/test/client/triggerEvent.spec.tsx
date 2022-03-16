import { _onPageLoad, triggerEvent } from '../../src/client';
import * as fusion from '../../src/renderer';

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
    _onPageLoad(app, root, 'abc');
    triggerEvent('abc', (root.children[0] as any).id, { type: 'click' });
    expect(called).toBeTruthy()
})

test('bubbles', async () => {
    let called = false;
    const Comp = fusion.defineComponent({
        render() {
            return <span>hello</span>
        }
    })
    const app = fusion.createApp(fusion.defineComponent({
        render() {
            return <div onClick={() => {
                called = true;
            }}><Comp /></div>
        }
    }));
    const root = fusion.nodeOps.createElement('view');
    _onPageLoad(app, root, 'abc');
    triggerEvent('abc', (root.children[0] as any).children[0].id, { type: 'click' }, { bubbles: true });
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
    const app = fusion.createApp(fusion.defineComponent({
        render() {
            return <div onClick={() => {
                called = true;
            }}><Comp /></div>
        }
    }));
    const root = fusion.nodeOps.createElement('view');
    _onPageLoad(app, root, 'abc');
    triggerEvent('abc', (root.children[0] as any).children[0].id, { type: 'click' }, { bubbles: true });
    expect(called).toBeFalsy()
})

test('trigger re-render', async () => {
    const app = fusion.createApp(fusion.defineComponent({
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
    const root = fusion.nodeOps.createElement('view');
    let renderCount = 0;
    app.provide(fusion.flushElementsKey, (elements) => {
        renderCount++;
    })
    _onPageLoad(app, root, 'abc');
    await new Promise<void>(resolve => fusion.nextTick(resolve));
    expect(renderCount).toBe(1);
    triggerEvent('abc', (root.children[0] as any).id, { type: 'click' });
    await new Promise<void>(resolve => fusion.nextTick(resolve));
    expect(renderCount).toBe(2);
})