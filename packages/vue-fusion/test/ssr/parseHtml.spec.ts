import { encodeNode, resetFragmentId, resetNodeId } from '../../src/renderer';
import { parseHtml } from '../../src/ssr/parseHtml';

beforeEach(() => {
    resetNodeId();
    resetFragmentId();
})

test('text', () => {
    const root = parseHtml('<div>hello</div>');
    expect(encodeNode(root).children).toEqual([{
        tag: 'fragment',
        id: 'fragment1',
        children: [{
            tag: 'div',
            id: 'elem2',
            children: ['hello']
        }]
    }]);
})

test('attrs', () => {
    const root = parseHtml('<div><span title="abc"/></div>');
    expect(encodeNode(root).children).toEqual([{
        tag: 'fragment',
        id: 'fragment1',
        children: [{
            tag: 'div',
            id: 'elem2',
            children: [{
                tag: 'span',
                id: 'elem3', 
                title: "abc",
                children: []
            }]
        }]
    }]);
})