import * as fusion from 'vue-fusion';
import RoundBox from '../../shared/RoundBox';

export default fusion.defineComponent({
    render() {
        return <RoundBox>
            {() => 'asdfdf'}
        </RoundBox>
    }
})