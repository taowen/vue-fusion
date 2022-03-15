import * as fusion from 'vue-fusion';

const Comp = fusion.defineComponent({
    data() {
        return {
            msg: 'hello world!!!'
        }
    },
    render() {
        return <view onTap={() => {
            this.msg = 'updated~~~';
        }}>{ this.msg }</view>
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