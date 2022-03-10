import * as vite from 'vite';

export default vite.defineConfig({
    build: {
        lib: {
            entry: 'src/renderVue.ts',
            formats: ['es']
        }
    }
})