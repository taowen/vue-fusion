import { onPageLoad } from 'vue-fusion/client';
import { serverRender } from 'vue-fusion';
import * as fusion from '../../src/renderer';
import { createApp, resetFragmentId, resetNodeId } from '../../src/renderer';

test('dehydrate and hydrate', async () => {
    resetNodeId();
    resetFragmentId();
    fusion.$app.create = () => {
        return {
            app: createApp(fusion.defineComponent({
                render() {
                    return <div>
                        <spacer />
                        100
                        <spacer />
                    </div>
                }
            }))
        };
    }
    const fragments = await serverRender('/');
    (global as any).clientHost = {
        updatePages(pageUpdates: any) {
            expect(pageUpdates).toEqual([["abc", "", [{ "tag": "fragment", "id": "fragment2", "children": [{ "tag": "div", "id": "elem2", "children": [{ "tag": "spacer", "id": "elem3", "children": [] }, "100", { "tag": "spacer", "id": "elem4", "children": [] }] }] }]]])
        }
    };
    await onPageLoad('abc', '/', fragments);
})