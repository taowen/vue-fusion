/// <reference types="define-function/__s__" />
import * as fusion from 'vue-fusion';
import { range } from '../../shared/range';
import RoundBox from '../../shared/RoundBox';
import CalendarMonth from './CalendarMonth';

class Month {
    constructor(public year: number, public month: number) {
    }
    get next() {
        let year = this.year;
        let month = this.month + 1;
        if (month === 12) {
            year += 1;
            month = 0;
        }
        return new Month(year, month);
    }
    get prev() {
        let year = this.year;
        let month = this.month - 1;
        if (month === -1) {
            year -= 1;
            month = 11;
        }
        return new Month(year, month);
    }
    get id() {
        return `m-${this.year}-${this.month}`
    }
}

export default fusion.defineComponent({
    data() {
        const today = new Date();
        const todayMonth = new Month(today.getFullYear(), today.getMonth());
        return {
            currentMonth: todayMonth
        }
    },
    computed: {
        months(): Month[] {
            return [this.currentMonth.prev, this.currentMonth, this.currentMonth.next]
        }
    },
    render() {
        let lastEventTime = new Date().getTime();
        return <RoundBox>
                {() => <view class="flex-col gap-2">
                <view>{`${this.currentMonth.year}年${this.currentMonth.month + 1}月`}</view>
                <view class="flex-row w-full justify-around">
                    {range(7, i =>
                        <view class={i === 5 || i === 6 ? 'color-2' : 'color-1'}>
                            {['一', '二', '三', '四', '五', '六', '日'][i]}
                        </view>)}</view>
                    <scroll-view id="the-scroll-view" scroll-x enhanced paging-enabled style="white-space: nowrap;" scroll-into-view={this.currentMonth.id} onScrolltolower={(e) => {
                        if (new Date().getTime() - lastEventTime < 1000) {
                            return;
                        }
                        lastEventTime = new Date().getTime();
                        this.currentMonth = this.months[this.months.length - 1];
                    }} onScrolltoupper={e => {
                        if (new Date().getTime() - lastEventTime < 1000) {
                            return;
                        }
                        lastEventTime = new Date().getTime();
                        this.currentMonth = this.months[0];
                    }}>
                        {this.months.map(m => <CalendarMonth id={m.id} year={m.year} month={m.month}/>)}
                    </scroll-view>
                </view>}
        </RoundBox>
    }
})