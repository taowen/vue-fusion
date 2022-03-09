import * as renderer from '../src/renderer';
import * as vue from '@vue/runtime-core';

test('text', () => {
    const app = renderer.createApp(vue.defineComponent({
        render() {
            return 'hello'
        }
    }));
    const root = renderer.nodeOps.createElement('div');
    const text = renderer.nodeOps.createText('hello');
    text.parentNode = root;
    root.children.push(text);
    console.log(text);
    // app.mount(root);
    console.log(JSON.stringify(root));
})