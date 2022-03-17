declare namespace JSX {
    interface IntrinsicElements {
        view: {
            class?: string
            onTap?: Function,
            style?: Record<string, string>
        };
    }
}
