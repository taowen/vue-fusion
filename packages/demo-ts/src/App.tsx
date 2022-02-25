import { defineComponent } from "vue";
export default defineComponent({
    data() {
        return {
            msg: 'hello'
        }
    },
    render() {
        return <div>{this.msg}</div>
    }
})