/// <reference types="miniprogram-api-typings/index" />
import * as fusion from 'vue-fusion';
import Calendar from './Calendar/Calendar';
import Huangli from './Huangli/Huangli';

export default fusion.defineComponent({
    inheritAttrs: false,
    render() {
        const pageStyle = `
        --color-1: #0b090a;
        --color-2: #a4161a;
        --color-3: #fae0e4;
        --color-4: #f7f7f7;
        background-color: var(--color-4);
        color: var(--color-1);
        `
        return <>
            <page-meta page-style={pageStyle} />
            <view style="height: var(--navBarHeight)" />
            <view class="flex-col m-2 gap-2">
                <Calendar />
                <Huangli />
            </view>
        </>
    }
})