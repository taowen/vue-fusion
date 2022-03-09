import * as renderer from '../src/renderer';
import * as vue from '@vue/runtime-core';

test('text', () => {
    const app = renderer.createApp(vue.defineComponent({
        render() {
            return 'hello'
        }
    }));
    const root = renderer.nodeOps.createElement('div');
    app.mount(root);
    expect(renderer.toMpData(root)).toEqual({
        tag: 'div',
        children: ['hello']
    })
})