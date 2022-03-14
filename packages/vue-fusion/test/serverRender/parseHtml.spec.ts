import { encodeNode } from '../../src/renderer';
import { parseHtml } from '../../src/serverRender/parseHtml';

test('text', () => {
    const root = parseHtml('<div>hello</div>');
    expect(encodeNode(root).children).toEqual([{
        tag: 'fragment',
        children: [{
            tag: 'div',
            props: { id: 'elem1' },
            children: ['hello']
        }]
    }]);
})

test('attrs', () => {
    const root = parseHtml('<div><span title="abc"/></div>');
    expect(encodeNode(root).children).toEqual([{
        tag: 'fragment',
        children: [{
            tag: 'div',
            props: { id: 'elem3' },
            children: [{
                tag: 'span',
                props: { id: 'elem4', title: "abc" },
                children: []
            }]
        }]
    }]);
})