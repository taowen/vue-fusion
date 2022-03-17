/// <reference types="miniprogram-api-typings/index" />
import * as fusion from 'vue-fusion';

const RoundBox = fusion.styled('view')`
    border: 1px solid #fff;
    border-radius: 8px;
    background-color: #fff;
`

export default fusion.defineComponent({
    data() {
        return {
            msg: 'hello world~~~'
        }
    },
    render() {
        if (typeof wx !== 'undefined') {
            wx.setBackgroundColor({
                backgroundColor: '#f7f7f7'
            });
            wx.setNavigationBarColor({
                frontColor: '#000000',
                backgroundColor: '#f7f7f7'
            })
        }
        return <view style={{ 'min-height': '100vh', 'background-color': '#f7f7f7' }}>
            <view class="flex-row">
                <spacer class="w-2" />
                <RoundBox class="grow" onTap={() => { wx.navigateTo({ url: '/About' }); }}>{() => this.msg}</RoundBox>
                <spacer class="w-2" />
            </view>
        </view>
    }
})