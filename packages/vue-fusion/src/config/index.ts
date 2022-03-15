import { UserConfig } from 'vite';

export function injectDefaultViteConfig(config: UserConfig) {
    if (!config.plugins) {
        config.plugins = [];
    }
    config.plugins.push({
        name: 'provide @app',
        resolveId(id) {
            if (id === '@app') {
                return 'src/createApp.tsx'
            }
        },
    })
    Object.assign(config, {
        ssr: {
            noExternal: /./
        }
    })
    return config;
}