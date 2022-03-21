import * as fusion from 'vue-fusion';
import { COLOR3 } from '../../shared/colors';
import { range } from '../../shared/range';
import { solar2lunar } from './solar2lunar';
import { useSelectedDate } from './CalendarMonth';
import * as vdb from 'vue-db';

const CalendarDay = fusion.defineComponent({
    props: {
        date: {
            default: new Date()
        }
    },
    data() {
        return {
            selected: useSelectedDate().selectedDate.getTime() === this.date.getTime()
        }
    },
    methods: {
        select() {
            useSelectedDate().select(this.date);
            for (const day of vdb.query(CalendarDay, { $root: vdb.pageOf(this)})) {
                if (day.selected) {
                    day.selected = false;
                }
            }
            this.selected = true;
        }
    },
    render() {
        const date = this.date.getDate();
        const { lunarFestival, festival, IDayCn } = solar2lunar(this.date.getFullYear(), this.date.getMonth() + 1, this.date.getDate());
        const comment = lunarFestival || festival || IDayCn;
        const style = this.selected ? {
            border: '1px solid red',
            ['border-radius']: '4px',
            ['background-color']: COLOR3
        } : undefined;
        return <view class="grow flex-col" style={style} onTap={() => { 
            this.select();
         }}>
            <spacer class="h-2"/>
            <view class="flex-row gap-1">
                <spacer class="grow"/>
                <view style={{['font-weight']: 'bold'}}>{(date < 10 ? '0' : '') + date}</view>
                <view class="flex-col">
                    <spacer class="grow" />
                    {range(comment.length, i => <view style={{['font-weight']: '100', ['font-size']: comment.length === 2 ? '10px' : '8px'}}>{comment[i]}</view>)}
                    <spacer class="grow" />
                </view>
                <spacer class="grow"/>
            </view>
            <spacer class="h-2"/>
        </view>
    }
})

export default CalendarDay;