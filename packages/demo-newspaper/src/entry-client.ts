import * as fusion from 'vue-fusion';

const app = fusion.createApp(fusion.defineComponent({
    render() {
        return 'hello';
    }
}));
app.mount(fusion.nodeOps.createElement('view'));

