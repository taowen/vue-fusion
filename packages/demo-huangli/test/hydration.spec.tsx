import { resetFragmentId, resetNodeId, createApp } from 'vue-fusion';
import * as fusion from 'vue-fusion';
import { serverRender } from 'vue-fusion';
import { onPageLoad } from 'vue-fusion/client';
import IndexPage from '../src/pages/[...all]';
import { createPinia } from 'pinia';
import * as vdb from 'vue-db';

declare const global: any;

test('hydration', async () => {
    resetNodeId();
    resetFragmentId();
    let dehydrate = false;
    let hydrate = false;
    fusion.$app.create = () => {
        const app = createApp(fusion.defineComponent({
            render() {
                return <IndexPage/>
            }
        }));
        app.use(createPinia())
        app.use(vdb, {
            dehydrate,
            hydrate,
            wrapperComponent: 'view',
            rpcProvider(queries) {
                queries[0].resolve([{
                    day: '1-2-3',
                    suit: 'abc'
                }]);
            }
        } as vdb.InstallOptions);
        return { app };
    }
    dehydrate = true;
    hydrate = false;
    const fragments = await serverRender('/');
    (global as any).clientHost = {
        updatePages(pageUpdates: any) {
            // console.log(JSON.stringify(pageUpdates));
            // expect(pageUpdates).toEqual([["abc", "", [{ "tag": "fragment", "id": "fragment2", "children": [{ "tag": "div", "id": "elem2", "children": [{ "tag": "spacer", "id": "elem3", "children": [] }, "100", { "tag": "spacer", "id": "elem4", "children": [] }] }] }]]])
        }
    };
    dehydrate = false;
    hydrate = true;
    await onPageLoad('abc', '/', fragments);
    await new Promise(resolve => setTimeout(resolve, 100));
})