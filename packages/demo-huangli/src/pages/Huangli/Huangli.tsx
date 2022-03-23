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
        return {
            info
        }
    },
    render() {
        return <RoundBox>
        {() => this.info.data?.suit}
    </RoundBox>
    }
})