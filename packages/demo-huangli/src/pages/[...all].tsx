/// <reference types="miniprogram-api-typings/index" />
import * as fusion from 'vue-fusion';
import CalendarMonth from './Calendar/CalendarMonth';
import Huangli from './Huangli/Huangli';

export default fusion.defineComponent({
    inheritAttrs: false,
    render() {
        return <>
            <page-meta page-style="background-color: #f7f7f7" />
            <view style="height: var(--navBarHeight)" />
            <view class="flex-row">
                <spacer class="w-4" />
                <view class="flex-col grow">
                    <spacer class="h-2" />
                    <CalendarMonth />
                    <spacer class="h-2" />
                    <Huangli />
                </view>
                <spacer class="w-4" />
            </view>
        </>
    }
})