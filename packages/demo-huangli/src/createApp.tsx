/// <reference types="vite-plugin-pages/client" />
import * as fusion from 'vue-fusion';
import { createMemoryHistory, createRouter, RouterView } from 'vue-router';
import routes from '~pages';
import { createPinia } from 'pinia';
import * as vdb from 'vue-db';

fusion.$app.create = () => {
    const router = createRouter({
        history: createMemoryHistory(),
        routes,
    })
    const app = fusion.createApp(fusion.defineComponent({
        errorCaptured(err) {
            console.log(`caught error: ${err}`);
        },
        render() {
            return <RouterView/>
        }
    }));
    app.use(router);
    app.use(createPinia())
    app.use(vdb, {
        dehydrate: typeof wx === 'undefined',
        hydrate: typeof wx !== 'undefined',
        wrapperComponent: 'view',
        rpcProvider(queries) {
            queries[0].resolve([{
                day: '1-2-3',
                suit: 'abc'
            }]);
        }
    } as vdb.InstallOptions);
    return { app, router } as const;
};