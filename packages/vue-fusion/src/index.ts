import * as vue from 'vue';

export function defineComponent<T>(specClass: { new(): T }, options: {
    props?: (keyof T)[],
    onMounted?: (this: T) => void,
    render: (this: T) => any
}) {
    const spec = new specClass() as any;
    return vue.defineComponent({
        data() {
            return spec
        },
        render: options.render
    })
}