/// <reference types="miniprogram-api-typings/index" />
import * as fusion from 'vue-fusion';
import CalendarDay from './Calendar/CalendarDay';
import { getMonthCalendarStart } from './getMonthCalendarStart';

const RoundBox = fusion.styled('view')`
    border: 1px solid #fff;
    border-radius: 8px;
    background-color: #fff;
`

const COLOR1 = '#0b090a';
const COLOR2 = '#a4161a';

function range<T>(max: number, transform: (i: number) => T) {
    let arr = [];
    for (let i = 0; i < max; i++) {
        arr.push(transform(i));
    }
    return arr;
}

function addDays(date: Date, daysToAdd: number) {
    const newDate = new Date(date.getTime())
    newDate.setDate(newDate.getDate() + daysToAdd);
    return newDate;
}

export default fusion.defineComponent({
    inheritAttrs: false,
    data() {
        return {
            msg: 'hello world~~~'
        }
    },
    render() {
        const startDate = getMonthCalendarStart(2022, 2);
        return <>
            <page-meta page-style="background-color: #f7f7f7" />
            <view style="height: var(--navBarHeight)" />
            <view class="flex-col">
                <spacer class="h-2" />
                <view class="flex-row">
                    <spacer class="w-2" />
                    <RoundBox class="grow">
                        <view class="flex-col gap-2">
                            <view class="flex-row">
                                {range(7, i => <view class="grow flex-row" style={{ color: i === 5 || i === 6 ? COLOR2 : COLOR1 }}>
                                    <spacer class="grow" />{['一', '二', '三', '四', '五', '六', '日'][i]}<spacer class="grow" />
                                </view>)}
                            </view>
                            <view class="flex-col gap-4">
                                <view class="flex-row" style={{ color: COLOR1, ['font-weight']: 'bold' }}>
                                    {range(7, i => <CalendarDay date={addDays(startDate, i)} />)}
                                </view>
                                <view class="flex-row" style={{ color: COLOR1, ['font-weight']: 'bold' }}>
                                    {range(7, i => <CalendarDay date={addDays(startDate, 7 + i)} />)}
                                </view>
                                <view class="flex-row" style={{ color: COLOR1, ['font-weight']: 'bold' }}>
                                    {range(7, i => <CalendarDay date={addDays(startDate, 14 + i)} />)}
                                </view>
                                <view class="flex-row" style={{ color: COLOR1, ['font-weight']: 'bold' }}>
                                    {range(7, i => <CalendarDay date={addDays(startDate, 21 + i)} />)}
                                </view>
                                <view class="flex-row" style={{ color: COLOR1, ['font-weight']: 'bold' }}>
                                    {range(7, i => <CalendarDay date={addDays(startDate, 28 + i)} />)}
                                </view>
                                <view class="flex-row" style={{ color: COLOR1, ['font-weight']: 'bold' }}>
                                    {range(7, i => <CalendarDay date={addDays(startDate, 35 + i)} />)}
                                </view>
                            </view>
                        </view>
                    </RoundBox>
                    <spacer class="w-2" />
                </view>
            </view>
        </>
    }
})