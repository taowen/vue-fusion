import * as fusion from 'vue-fusion';
import { range } from '../../shared/range';
import { solar2lunar } from './solar2lunar';


export default fusion.defineComponent({
    props: {
        date: {
            default: new Date()
        }
    },
    render() {
        const date = this.date.getDate();
        const { lunarFestival, festival, IDayCn } = solar2lunar(this.date.getFullYear(), this.date.getMonth() + 1, this.date.getDate());
        const comment = lunarFestival || festival || IDayCn;
        return <view class="grow flex-row gap-1" onTap={() => { wx.navigateTo({ url: '/About' }); }}>
            <spacer class="grow"/>
            <view style={{['font-weight']: 'bold'}}>{(date < 10 ? '0' : '') + date}</view>
            <view class="flex-col">
                <spacer class="grow" />
                {range(comment.length, i => <view style={{['font-weight']: '100', ['font-size']: comment.length === 2 ? '10px' : '8px'}}>{comment[i]}</view>)}
                <spacer class="grow" />
            </view>
            <spacer class="grow"/>
        </view>
    }
})