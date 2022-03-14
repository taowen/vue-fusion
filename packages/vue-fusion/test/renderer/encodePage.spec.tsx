import { encodePage, resetFragmentId, resetNodeId } from "../../src";
import { parseHtml } from "../../src/serverRender/parseHtml";

beforeEach(() => {
    resetNodeId();
    resetFragmentId();
})

test('whole page rerender', () => {
    const root = parseHtml('<div>hello</div>');
    root.pageId = 'abc';
    expect(encodePage([root])).toEqual([
        ["abc", "fragment1", [{ "tag": "div", "props": { "id": "elem2" }, "children": ["hello"] }]
        ]])
})