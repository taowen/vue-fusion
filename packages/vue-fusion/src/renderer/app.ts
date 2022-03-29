import { App } from 'vue';
import { Router } from 'vue-router';

export const $app = {
    create: (): { app: App, router?: Router } => {
        throw new Error('$app not injected');
    }
}