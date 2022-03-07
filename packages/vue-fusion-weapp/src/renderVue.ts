import * as renderer from './renderer';
import * as vue from '@vue/runtime-core';

const app = renderer.createApp(vue.defineComponent({
    render() {
        return 'hello'
    }
}));
const rootNode = {
    children: []
} as any;
app.mount(rootNode);

console.log(rootNode);