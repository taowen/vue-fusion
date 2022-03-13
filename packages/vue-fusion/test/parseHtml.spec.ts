import { parseHtml } from '../src/parseHtml';

test('text', () => {
    const fragments = parseHtml('<div>hello</div>');
    expect(fragments).toEqual([{
        tag: 'fragment',
        children: [{
            tag: 'div',
            props: { id: 'elem1' },
            children: ['hello']
        }]
    }]);
})

test('attrs', () => {
    const fragments = parseHtml('<div><span title="abc"/></div>');
    expect(fragments).toEqual([{
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