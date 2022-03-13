import * as fusion from '../src';
import { serialize, toMpData } from '../src';

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
    fusion.onPageLoad(app, root, 'abc');
    fusion.triggerEvent('abc', (root.children[0] as any).children[0].id, { type: 'click' }, { bubbles: true });
    expect(called).toBeTruthy()
})

test('stopPropagation', async () => {
    let called = false;
    const Comp = fusion.defineComponent({
        render() {
            return <span onClick={(e: fusion.Event) => {
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
    fusion.onPageLoad(app, root, 'abc');
    fusion.triggerEvent('abc', (root.children[0] as any).children[0].id, { type: 'click' }, { bubbles: true });
    expect(called).toBeFalsy()
})