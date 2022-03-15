import { iterateNodes } from '../src/serverRender/iterateNodes';

test('parse', () => {
    const callbacked: any = [];
    iterateNodes(`<!DOCTYPE html><a
    >
    <!--preload-links-->
    b<c title="hello"/>d</a>`, {
        onComment(comment) {
            callbacked.push(['comment', comment]);
        },
        onTagOpen(tag, attributes) {
            callbacked.push(['tagOpen', { tag, attributes }])
        },
        onTagClose(tag) {
            callbacked.push(['tagClose', { tag }])
        },
        onText(text) {
            callbacked.push(['text', text])
        }
    });
    expect(callbacked).toEqual([
        ['text', '<!DOCTYPE html>'],
        ['tagOpen', { tag: 'a', attributes: '    ' }],
        ['text', '\n    '],
        ['comment', 'preload-links'],
        ['text', '\n    b'],
        ['tagOpen', { tag: 'c', attributes: 'title="hello"' }],
        ['tagClose', { tag: 'c' }],
        ['text', 'd'],
        ['tagClose', { tag: 'a' }]
    ])
})