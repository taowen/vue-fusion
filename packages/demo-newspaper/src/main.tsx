import * as fusion from 'vue-fusion'

export function createApp() {
    const app = fusion.createApp(fusion.defineComponent({
        render() {
            return <span title="abc">hello</span>
        }
    }))
    return { app }
  }