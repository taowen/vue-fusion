import { h } from 'vue';

export function styled<T extends keyof JSX.IntrinsicElements>(comp: T): ((style1: TemplateStringsArray, ...args: any[]) => (props: JSX.IntrinsicElements[T], ctx: any) => any);
export function styled<T>(comp: T): ((style1: TemplateStringsArray, ...args: any[]) => T);
export function styled(comp: any) {
    return (style1: TemplateStringsArray, ...args: any[]) => {
        return ((props: any, ctx: any) => {
            const style2 = props.style;
            const mergedStyle = Object.assign(parseStyle(style1), parseStyle(style2))
            return h(comp, { ...props, style: mergedStyle }, ctx.slots)
        }) as any;
    }
}

function parseStyle(styleStr: string | object) {
    if (!styleStr) {
        return {};
    }
    if (typeof styleStr === 'object') {
        return styleStr;
    }
    const style: Record<string, string> = {};
    for (const line of styleStr.split(';')) {
        if (line.includes(':')) {
            const [k, v] = line.split(':', 2);
            style[k] = v;
        }
    }
    return style;
}