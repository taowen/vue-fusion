// render multiple layers of DOM Nodes in single WxNode
Component({
    properties: {
        id: null,
        nodes: null,
    },
    lifetimes: {
        attached() {
            if (!this.id) {
                return;
            }
            const pages = getCurrentPages();
            const currentPage = pages[pages.length - 1];
            if (!currentPage.fragments) {
                currentPage.fragments = {};
            }
            currentPage.fragments[this.id] = this;
        }
    },
    methods: {
        eh(e) {
            if (e.target.id) { 
                const { client } = require('./GenericPage');
                client.triggerEvent(this.getPageId(), e.target.id, e, { bubbles: true });
            }
        }
    }
})