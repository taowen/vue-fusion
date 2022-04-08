import * as vdb from 'vue-db';
import * as fusion from 'vue-fusion';
import { range } from '../../shared/range';
import SelectableBox from '../../shared/SelectableBox';
import TinyColumn from '../../shared/TinyColumn';
import { useSelectedDate } from './selectedDate';
import { solar2lunar } from './solar2lunar';

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
            for (const day of vdb.query(CalendarDay, { $root: vdb.pageOf(this) })) {
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
        return <SelectableBox class="flex-row items-center" selected={this.selected} onTap={() => { this.select(); }}>
            {() => <>
                <view class="font-bold">{(date < 10 ? '0' : '') + date}</view>
                <TinyColumn charsCount={comment.length}>
                    {
                        () => <>
                            {range(comment.length, i => <view>{comment[i]}</view>)}
                        </>
                    }
                </TinyColumn>
            </>}
        </SelectableBox>
    }
})

export default CalendarDay;