import { parseHtml } from '../src/parseHtml';

test('text', () => {
    const fragments = parseHtml('<div>hello</div>');
    expect(fragments).toEqual([{
        tag: 'fragment',
        children: [{
            tag: 'div',
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
            children: [{
                tag: 'span',
                props: { title: "abc" },
                children: []
            }]
        }]
    }]);
})