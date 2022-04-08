/// <reference types="define-function/__s__" />
import * as fusion from 'vue-fusion';
import { range } from '../../shared/range';
import RoundBox from '../../shared/RoundBox';
import CalendarMonth from './CalendarMonth';

export default fusion.defineComponent({
    data() {
        const today = new Date();
        return {
            year: today.getFullYear(),
            month: today.getMonth(),
        }
    },
    render() {
        let lastEventTime = new Date().getTime();
        return <RoundBox>
                {() => <view class="flex-col gap-2">
                <view>{`${this.year}年${this.month + 1}月`}</view>
                <view class="flex-row w-full justify-around">
                    {range(7, i =>
                        <view class={i === 5 || i === 6 ? 'color-2' : 'color-1'}>
                            {['一', '二', '三', '四', '五', '六', '日'][i]}
                        </view>)}</view>
                    <scroll-view id="the-scroll-view" scroll-x enhanced paging-enabled style="white-space: nowrap;" scroll-into-view="middlePage" onScrolltolower={(e) => {
                        if (new Date().getTime() - lastEventTime < 1000) {
                            return;
                        }
                        lastEventTime = new Date().getTime();
                        console.log('scroll to lower!', e)
                    }} onScrolltoupper={e => {
                        if (new Date().getTime() - lastEventTime < 1000) {
                            return;
                        }
                        lastEventTime = new Date().getTime();
                        console.log('scroll to upper', e);
                    }}>
                        <view class="w-full" style="display: inline-flex;">上个月</view>
                        <CalendarMonth id="middlePage" year={this.year} month={this.month}/>
                        <view style="display: inline-flex; width: 100%;">下个月</view>
                    </scroll-view>
                </view>}
        </RoundBox>
    }
})