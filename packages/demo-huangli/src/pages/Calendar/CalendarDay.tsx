import * as fusion from 'vue-fusion';
import { COLOR3 } from '../../shared/colors';
import { range } from '../../shared/range';
import { solar2lunar } from './solar2lunar';
import { useSelectedDate } from './CalendarMonth';


export default fusion.defineComponent({
    props: {
        date: {
            default: new Date()
        }
    },
    computed: {
        selected() {
            const selectedDate = useSelectedDate();
            return selectedDate.selectedDate.getTime() === this.date.getTime();
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
        return <view class="grow flex-col" style={style} onTap={() => { wx.navigateTo({ url: '/About' }); }}>
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