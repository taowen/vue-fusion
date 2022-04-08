/// <reference types="define-function/__s__" />
import * as fusion from 'vue-fusion';
import { range } from '../../shared/range';
import CalendarDay from './CalendarDay';

function addDays(date: Date, daysToAdd: number) {
    const newDate = new Date(date.getTime())
    newDate.setDate(newDate.getDate() + daysToAdd);
    return newDate;
}

export function getMonthCalendarStart(year: number, month: number) {
    var firstDayWeek = new Date(year, month, 1).getDay();       // 月份第一天星期几
    return new Date(year, month, 2 - firstDayWeek);
}

const today = new Date();
export default fusion.defineComponent({
    props: {
        id: { default: '' },
        year: { default: today.getFullYear() },
        month: { default: today.getMonth() }
    },
    computed: {
        startDate() {
            return getMonthCalendarStart(this.year, this.month);
        }
    },
    render() {
        return <view class="inline-flex-col w-full" id={this.id}>
            <view class="flex-row w-full justify-around">
                {range(7, i => <CalendarDay date={addDays(this.startDate, i)} />)}
            </view>
            <view class="flex-row w-full justify-around">
                {range(7, i => <CalendarDay date={addDays(this.startDate, 7 + i)} />)}
            </view>
            <view class="flex-row w-full justify-around">
                {range(7, i => <CalendarDay date={addDays(this.startDate, 14 + i)} />)}
            </view>
            <view class="flex-row w-full justify-around">
                {range(7, i => <CalendarDay date={addDays(this.startDate, 21 + i)} />)}
            </view>
            <view class="flex-row w-full justify-around">
                {range(7, i => <CalendarDay date={addDays(this.startDate, 28 + i)} />)}
            </view>
            <view class="flex-row w-full justify-around">
                {range(7, i => <CalendarDay date={addDays(this.startDate, 35 + i)} />)}
            </view>
        </view>
    }
})