/// <reference types="miniprogram-api-typings/index" />
import * as fusion from 'vue-fusion';

const RoundBox = fusion.styled('view')`
    border: 1px solid #fff;
    border-radius: 8px;
    background-color: #fff;
`

export default fusion.defineComponent({
    inheritAttrs: false,
    data() {
        return {
            msg: 'hello world~~~'
        }
    },
    render() {
        return <>
            <page-meta page-style="background-color: #f7f7f7">
                <navigation-bar title="hello"/>
            </page-meta>
            <view class="flex-row">
                <spacer class="w-2" />
                <RoundBox class="grow" onTap={() => { wx.navigateTo({ url: '/About' }); }}>{() => this.msg}</RoundBox>
                <spacer class="w-2" />
            </view>
        </>
    }
})