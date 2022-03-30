import { h } from 'vue';

type styleProvider<P> = (props: P) => any;

type intrinsicElementWrapper<T extends keyof JSX.IntrinsicElements, P> = ((style1: TemplateStringsArray, ...args: styleProvider<JSX.IntrinsicElements[T] & P>[]) => (props: JSX.IntrinsicElements[T] & P, ctx: any) => any) & {
    withProps<EP>(extraProps?: JSX.IntrinsicElements[T] & P): intrinsicElementWrapper<T, P & EP>;
};

export function styled<T extends keyof JSX.IntrinsicElements>(comp: T): intrinsicElementWrapper<T, {}>;
export function styled<T>(comp: T): ((style1: TemplateStringsArray, ...args: styleProvider<Record<string, any>>[]) => T);
export function styled(comp: any) {
    const extraProps = {};
    const f = (styleArr: TemplateStringsArray, ...styleProviders: any[]) => {
        return ((props: any, ctx: any) => {
            if (props.style) {
                throw new Error('style can only be specified in styled component');
            }
            let style = styleArr.join('');
            for (const styleProvider of styleProviders) {
                const extraStyle = styleProvider(props);
                if (extraStyle) {
                    style += extraStyle;
                }
            }
            return h(comp, { ...extraProps, ...props, style }, ctx.slots)
        }) as any;
    };
    f.withProps = (props: any) => {
        if(props) {
            Object.assign(extraProps, props);
        }
        return f
    };
    return f;
}