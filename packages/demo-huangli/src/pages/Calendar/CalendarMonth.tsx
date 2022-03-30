import { defineStore } from 'pinia';
import * as fusion from 'vue-fusion';
import { COLOR1, COLOR2 } from '../../shared/colors';
import { range } from '../../shared/range';
import RoundBox from '../../shared/RoundBox';
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

export const useSelectedDate = defineStore('selectedDate', {
    state() {
        const today = new Date();
        return {
            selectedDate: new Date(today.getFullYear(), today.getMonth(), today.getDate())
        }
    },
    actions: {
        select(newDate: Date) {
            this.selectedDate = newDate;
        }
    }
})

export default fusion.defineComponent({
    data() {
        const today = new Date();
        return {
            year: today.getFullYear(),
            month: today.getMonth()
        }
    },
    render() {
        const startDate = getMonthCalendarStart(this.year, this.month);
        return <RoundBox class="grow">
            {() =>
                <view class="flex-col">
                    <spacer class="h-2"/>
                    <view class="flex-row">
                        <spacer class="w-2" style="flex-shrink: 0"/>
                        <view class="flex-col gap-2 grow">
                            <view>{`${this.year}年${this.month+1}月`}</view>
                            <view class="flex-row">
                                {range(7, i => <view class="grow flex-row" style={{ color: i === 5 || i === 6 ? COLOR2 : COLOR1 }}>
                                    <spacer class="grow" />{['一', '二', '三', '四', '五', '六', '日'][i]}<spacer class="grow" />
                                </view>)}
                            </view>
                            <scroll-view scroll-x enhanced paging-enabled style="white-space: nowrap; overflow: hidden; min-width: 0;" scroll-into-view="middlePage">
                                <view style="display: inline-flex; width: 100%;">上个月</view>
                                <view class="inline-flex-col gap-2;" style="width: 100%;">
                                    <view class="flex-row" style={{ color: COLOR1 }}>
                                        {range(7, i => <CalendarDay date={addDays(startDate, i)} />)}
                                    </view>
                                    <view class="flex-row" style={{ color: COLOR1 }}>
                                        {range(7, i => <CalendarDay date={addDays(startDate, 7 + i)} />)}
                                    </view>
                                    <view class="flex-row" style={{ color: COLOR1 }}>
                                        {range(7, i => <CalendarDay date={addDays(startDate, 14 + i)} />)}
                                    </view>
                                    <view class="flex-row" style={{ color: COLOR1 }}>
                                        {range(7, i => <CalendarDay date={addDays(startDate, 21 + i)} />)}
                                    </view>
                                    <view class="flex-row" style={{ color: COLOR1 }}>
                                        {range(7, i => <CalendarDay date={addDays(startDate, 28 + i)} />)}
                                    </view>
                                    <view class="flex-row" style={{ color: COLOR1 }}>
                                        {range(7, i => <CalendarDay date={addDays(startDate, 35 + i)} />)}
                                    </view>
                                </view>
                                <view style="display: inline-flex; width: 100%;">下个月</view>
                            </scroll-view>
                        </view>
                        <spacer class="w-2" style="flex-shrink: 0"/>
                    </view>
                </view>
            }
        </RoundBox>
    }
})