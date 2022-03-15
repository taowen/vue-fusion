import { App } from '@vue/runtime-core';
import { Router } from 'vue-router';

export * from './renderer';
export * from '@vue/runtime-core';
export const $app = {
    create: (): { app: App, router: Router } => {
        throw new Error('$app not injected');
    }
}