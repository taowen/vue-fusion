/// <reference types="miniprogram-api-typings/index" />
import * as fusion from 'vue-fusion';
import CalendarMonth from './Calendar/CalendarMonth';

export default fusion.defineComponent({
    inheritAttrs: false,
    render() {
        return <>
            <page-meta page-style="background-color: #f7f7f7" />
            <view style="height: var(--navBarHeight)" />
            <view class="flex-col">
                <spacer class="h-2" />
                <view class="flex-row">
                    <spacer class="w-2" />
                    <CalendarMonth />
                    <spacer class="w-2" />
                </view>
            </view>
        </>
    }
})