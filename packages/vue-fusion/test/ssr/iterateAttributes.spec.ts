import { iterateAttributes } from '../../src/ssr/iterateAttributes';


test('parse', () => {
    const attrs: Record<string, any> = {};
    iterateAttributes('disabled title="中文"       style="" checked ', {
        onAttribute(name, value) {
            attrs[name] = value;
        },
        onAttributeEnabled(name) {
            attrs[name] = true;
        }
    });
    expect(attrs).toEqual({
        disabled: true,
        checked: true,
        title: '中文',
        style: ''
    })
})