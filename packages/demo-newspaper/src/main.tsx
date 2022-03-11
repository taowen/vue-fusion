import * as fusion from 'vue-fusion'

export function createApp() {
    const app = fusion.createApp(fusion.defineComponent({
        render() {
            return <view>hello world!!!</view>
        }
    }))
    return { app }
  }