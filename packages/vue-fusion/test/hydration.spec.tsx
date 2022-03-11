import * as fusion from '../src';

test('1 layer', () => {
    const app = fusion.createApp(fusion.defineComponent({
        beforeMount() {
            expect(this.$el.props['hello']).toEqual('world');
        },
        render() {
            return <span>hello</span>
        }
    }));
    const root = fusion.nodeOps.createElement('div');
    const span = fusion.nodeOps.createElement('span');
    span.props['hello'] = 'world';
    fusion.nodeOps.insert(fusion.nodeOps.createText('hello'), span);
    fusion.nodeOps.insert(span, root);
    app.mount(root);
})