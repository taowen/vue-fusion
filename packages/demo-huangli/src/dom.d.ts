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
        ['scroll-view']: {
            id?: string
            class?: string
            ['scroll-x']?: boolean
            ['paging-enabled']?: boolean
            enhanced?: boolean
            style?: string
            ['scroll-into-view']?: string
            onScrolltoupper?: (e: any) => void
            onScrolltolower?: (e: any) => void
        }
    }
}
