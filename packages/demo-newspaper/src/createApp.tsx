import * as fusion from 'vue-fusion';

const Comp = fusion.defineComponent({
    data() {
        return {
            msg: 'hello world!!!'
        }
    },
    render() {
        console.log('render');
        try {
            return <view onTap={() => {
                this.msg = 'updated~~~';
                console.log('msg updated');
            }}>{ this.msg }</view>
        } catch(e) {
            console.error(`failed to render: ${e}`);
        }
    }
})

export default () => fusion.createApp(fusion.defineComponent({
    errorCaptured(err) {
        console.log(`caught error: ${err}`);
    },
    render() {
        return <Comp />
    }
}));