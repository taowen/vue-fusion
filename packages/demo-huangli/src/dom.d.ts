declare namespace JSX {
    interface IntrinsicElements {
        ['page-meta']: {
            'page-style'?: string
        },
        ['navigation-bar']: {
            'title'?: string
        }
        view: {
            id?: string
            class?: string
            onTap?: Function
            style?: Record<string, string> | string
        };
    }
}
