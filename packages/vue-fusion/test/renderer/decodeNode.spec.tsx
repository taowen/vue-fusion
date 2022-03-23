import { encodeNode, decodeNode } from "../../src/renderer/JNode";

test('decode and encode back', () => {
    const jnode = {
        tag: 'div',
        id: 'elem1',
        children: [{
            tag: 'fragment',
            id: 'fragment1',
            children: [{
                tag: 'span',
                id: 'elem2',
                children: ['hello']
            }]
        }]
    };
    const hnode = decodeNode(jnode)
    expect(encodeNode(hnode)).toEqual(jnode);
})