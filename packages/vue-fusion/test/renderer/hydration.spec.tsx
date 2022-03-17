import * as fusion from '../../src/renderer';
import { createApp, encodeNode, nodeOps } from '../../src/renderer';

test('beforeMount can get the element', () => {
    const app = createApp(fusion.defineComponent({
        beforeMount() {
            expect(this.$el.props['hello']).toEqual('world');
        },
        render() {
            return <span>hello</span>
        }
    }));
    const root = nodeOps.createElement('div');
    const span = nodeOps.createElement('span');
    span.props['hello'] = 'world';
    nodeOps.insert(nodeOps.createText('hello'), span);
    nodeOps.insert(span, root);
    app.mount(root);
})