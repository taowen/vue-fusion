import * as fusion from 'vue-fusion';


export default fusion.defineComponent({
    props: ['date'],
    render() {
        const date = this.date.getDate();
        return <view class="grow flex-row" onTap={() => { wx.navigateTo({ url: '/About' }); }}>
            <spacer class="grow"/>
            {(date < 10 ? '0' : '') + date}
            <spacer class="grow"/>
        </view>
    }
})