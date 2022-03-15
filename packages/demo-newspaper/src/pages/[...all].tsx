import * as fusion from 'vue-fusion';

export default fusion.defineComponent({
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