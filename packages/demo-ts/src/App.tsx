import { defineComponent } from "vue"

// index.tsx
export default defineComponent({
    data() {
        return {
            msg: 'hello'
        }
    },
    render() {
        return <div> {this.msg} </div>
    }
})