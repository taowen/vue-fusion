import { encodePageUpdates, HElement, nodeOps, resetFragmentId, resetNodeId } from "../../src";
import { parseHtml } from "../../src/serverRender/parseHtml";

beforeEach(() => {
    resetNodeId();
    resetFragmentId();
})

test('whole page rerender', () => {
    const root = parseHtml('<div>hello</div>');
    root.pageId = 'abc';
    expect(encodePageUpdates([root])).toEqual([
        ["abc", "fragment1", [{ "tag": "div", "props": { "id": "elem2" }, "children": ["hello"] }]
        ]])
})

test('rerender one fragment', () => {
    const root = parseHtml('<span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/>');
    root.pageId = 'abc';
    encodePageUpdates([root]);
    expect(root.fragments!.length).toBe(2);
    const elem = root.fragments![1].children[0] as HElement;
    nodeOps.setElementText(elem, 'hello');
    expect(encodePageUpdates([elem])).toEqual([
        ["abc", "fragment2", [
            { "tag": "span", "props": { "id": "elem11" }, "children": ["hello"] },
            { "tag": "span", "props": { "id": "elem12" }, "children": [] }]]
    ])
})