import * as vue from 'vue';
import * as fusion from 'vue-fusion';

export default () => fusion.createApp(vue.defineComponent({
    render() {
        return <view>hello world!!!</view>
    }
}));