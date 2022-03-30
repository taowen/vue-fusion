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
        const style: Record<string, string> = this.selected ? {
            border: '1px solid red',
            ['border-radius']: '4px',
            padding: '0.5rem',
            ['background-color']: COLOR3
        } : { padding: '0.5rem' };
        return <view class="flex-row items-center" style={style} onTap={() => { 
            this.select();
         }}>
                <view style={{['font-weight']: 'bold'}}>{(date < 10 ? '0' : '') + date}</view>
                <view class="flex-col">
                    {range(comment.length, i => <view style={{['font-weight']: '100', ['font-size']: comment.length === 2 ? '10px' : '8px'}}>{comment[i]}</view>)}
                </view>
            </view>
    }
})

export default CalendarDay;