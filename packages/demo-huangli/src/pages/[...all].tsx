/// <reference types="miniprogram-api-typings/index" />
import * as fusion from 'vue-fusion';

const RoundBox = fusion.styled('view')`
    border: 1px solid #bfbfbf;
    border-radius: 8px;
    background-color: #f7f7f7;
`

export default fusion.defineComponent({
    data() {
        return {
            msg: 'hello world~~~'
        }
    },
    render() {
        return <view class="flex-row">
            <spacer class="w-2"/>
            <RoundBox class="grow" onTap={() => { wx.navigateTo({ url: '/About' }); }}>{() => this.msg}</RoundBox>
            <spacer class="w-2"/>
        </view>
    }
})