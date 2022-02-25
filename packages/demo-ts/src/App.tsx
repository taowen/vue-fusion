import * as fusion from 'vue-fusion';

export default fusion.defineComponent(class {
    // props
    readonly prop1?: string;
    // data
    msg = 'hello';
    // methods
    onClick() {

    }
}, {
    props: ['prop1'],
    onMounted() {
        console.log('onMounted', this.msg);
    },
    render() {
        return <div>{this.msg}</div>
    }
})