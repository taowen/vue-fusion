/// <reference types="vite-plugin-pages/client" />
import * as fusion from 'vue-fusion';
import { createMemoryHistory, createRouter, RouterView } from 'vue-router';
import routes from '~pages';

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
    return { app, router } as const;
};