import { createSSRApp, defineComponent } from 'vue'

export function createApp() {
    const app = createSSRApp(defineComponent({
        render() {
            return 'hello'
        }
    }))
    return { app }
  }