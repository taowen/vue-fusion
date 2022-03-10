import { iterateAttributes } from './iterateAttributes';
import { iterateNodes } from './iterateNodes';

export function extractScripts(html: string) {
    const scripts: string[] = [];
    iterateNodes(html, {
        onTagOpen(tag, attributes) {
            if (tag === 'script') {
                iterateAttributes(attributes, {
                    onAttribute(name, value) {

                        if (name === 'src') {
                            scripts.push(value);
                        }
                    },
                    onAttributeEnabled() {
                    }
                })
            } else if (tag === 'link') {
                iterateAttributes(attributes, {
                    onAttribute(name, value) {
                        if (name === 'href' && value.endsWith('.js')) {
                            scripts.push(value);
                        }
                    },
                    onAttributeEnabled() {
                    }
                })
            }
        }
    })
    return scripts;
}