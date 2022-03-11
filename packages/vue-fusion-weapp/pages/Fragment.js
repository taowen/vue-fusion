// render multiple layers of DOM Nodes in single WxNode
Component({
    properties: {
        nodes: null,
    },
    methods: {
        eh() {
            console.log(arguments);
        }
    }
})