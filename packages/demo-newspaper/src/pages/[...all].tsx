/// <reference types="miniprogram-api-typings/index" />
import * as fusion from 'vue-fusion';

export default fusion.defineComponent({
    data() {
        return {
            msg: 'hello world~~~'
        }
    },
    render() {
        return <view onTap={() => {
            wx.navigateTo({ url: '/About' });
        }}>{ this.msg }</view>
    }
})