import * as vdb from 'vue-db';
import * as fusion from 'vue-fusion';
import RoundBox from '../../shared/RoundBox';
import { useSelectedDate } from '../Calendar/CalendarMonth';

const DayInfo = vdb.defineResource<{
    day: string
    suit: string
    avoid: string
}>('DayInfo');

export default fusion.defineComponent({
    data() {
        const info = vdb.load(DayInfo, () => {
            const date = useSelectedDate().selectedDate;
            const day = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            return { day }
        });
        return { info }
    },
    render() {
        if (this.info.loading) {
            return <RoundBox>{() => '加载中...'}</RoundBox>
        }
        if (this.info.error) {
            return <RoundBox>{() => this.info.error}</RoundBox>
        }
        return <RoundBox>
            {
                () => <>
                    <view>{`宜：${this.info.data?.suit}`}</view>
                    <view>{`忌：${this.info.data?.avoid}`}</view>
                </>
            }
        </RoundBox>
    }
})