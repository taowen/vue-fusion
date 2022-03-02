import * as vue from 'vue';

const App = vue.defineComponent({
    render() {
        return vue.h('image', { 
            src: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'
        })
    }
})

export const document = {} as any;

export function renderPage() {
    const app = vue.createApp(App);
    app.mount(document);
}