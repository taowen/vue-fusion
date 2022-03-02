Component({
    properties: {
        type: null,
        props: null,
        children: null,
    },
    lifetimes: {
        attached() {
            console.log(this.data);
        }
    }
})