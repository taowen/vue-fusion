import * as renderer from './renderer';
import * as vue from '@vue/runtime-core';

const app = renderer.createApp(vue.defineComponent({
    data() {
        return {
            msg: 'hello'
        }
    },
    render() {
        return vue.h(vue.Fragment, {}, [
            vue.h('div', {}, this.msg),
            vue.h('div', {}, this.msg)
        ]);
    }
}));
const rootNode = {
    children: []
} as any;

async function main() {
    app.mount(rootNode);
    console.log(rootNode.children);
}

main();