import { createApp, defineComponent } from "../../src/renderer";
import * as fusion from '../../src/renderer';
import { serverRender } from "vue-fusion";
import { $app } from "vue-fusion";

test('tag with hyphen', async () => {
    const app = createApp(defineComponent({
        render() {
            return <page-meta />
        }
    }));
    $app.create = () => { return { app } };
    expect(JSON.stringify(await serverRender('/'))).toContain('page-meta');
})