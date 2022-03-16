import { App } from 'vue';
import { Router } from 'vue-router';

export * from './renderer';
export { defineComponent, nextTick, h, Fragment } from 'vue';
export type { App } from 'vue'
export const $app = {
    create: (): { app: App, router: Router } => {
        throw new Error('$app not injected');
    }
}