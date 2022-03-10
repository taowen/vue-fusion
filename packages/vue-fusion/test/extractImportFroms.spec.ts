import { extractImportFroms } from "../src/extractImportFroms"

test('extract', () => {
    const importFroms = Array.from(extractImportFroms(`
    import * as fusion from 'vue-fusion';

const app = fusion.createApp(fusion.defineComponent({
    render() {
        return 'hello';
    }
}));
app.mount(fusion.nodeOps.createElement('view'));
    `))
    expect(importFroms).toEqual(['vue-fusion']);
})