import { iterateNodes } from '../src/iterateNodes';

test('parse', () => {
    const callbacked: any = [];
    iterateNodes(`<!DOCTYPE html><a
    >
    <!--preload-links-->
    b<c title="hello"/>d</a>`, {
        onComment(comment) {
            callbacked.push(['comment', comment]);
        },
        onTagBegin(tag, attributes) {
            callbacked.push(['tagBegin', { tag, attributes }])
        },
        onTagEnd(tag) {
            callbacked.push(['tagEnd', { tag }])
        },
        onText(text) {
            callbacked.push(['text', text])
        }
    });
    expect(callbacked).toEqual([
        ['text', '<!DOCTYPE html>'],
        ['tagBegin', { tag: 'a', attributes: '    ' }],
        ['text', '\n    '],
        ['comment', 'preload-links'],
        ['text', '\n    b'],
        ['tagBegin', { tag: 'c', attributes: 'title="hello"' }],
        ['tagEnd', { tag: 'c' }],
        ['text', 'd'],
        ['tagEnd', { tag: 'a' }]
    ])
})