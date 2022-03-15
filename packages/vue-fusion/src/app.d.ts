declare module "@app" {
    import { App } from "vue-fusion";
    import { Router } from 'vue-router';
    
    export default function(): { app: App, router: Router };
}