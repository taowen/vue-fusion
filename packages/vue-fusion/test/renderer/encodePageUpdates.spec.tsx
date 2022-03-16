import * as fusion from '../../src/renderer';
import { encodePageUpdates, HElement, nodeOps, resetFragmentId, resetNodeId } from "../../src/renderer";

beforeEach(() => {
    resetNodeId();
    resetFragmentId();
})

test('whole page rerender', () => {
    const app = fusion.createApp(fusion.defineComponent({
        render() {
            return <div>hello</div>
        }
    }));
    const root = nodeOps.createElement('div');
    app.mount(root);
    root.pageId = 'abc';
    expect(encodePageUpdates([root])).toEqual([
        ["abc", '', [{ tag: 'fragment', id: 'fragment1', children: [{ tag: "div", id: "elem2", children: ['hello'] }] }]
        ]])
})

test('rerender one fragment', () => {
    const app = fusion.createApp(fusion.defineComponent({
        render() {
            return <>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
            </>
        }
    }));
    const root = nodeOps.createElement('div');
    app.mount(root);
    root.pageId = 'abc';
    encodePageUpdates([root]);
    expect(root.fragments!.length).toBe(2);
    const elem = root.fragments![1].children[0] as HElement;
    nodeOps.setElementText(elem, 'hello');
    expect(encodePageUpdates([elem])).toEqual([
        ["abc", "fragment2", [
            { tag: "span", id: "elem10", children: ["hello"] },
            { tag: "span", id: "elem11", children: ["10"] },
            ""
        ]]
    ])
})