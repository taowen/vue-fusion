// render multiple layers of DOM Nodes in single WxNode
Component({
    properties: {
        node: null,
    },
    methods: {
        ev() {
            console.log(arguments);
        }
    }
})