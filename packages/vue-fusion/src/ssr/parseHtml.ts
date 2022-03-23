import { iterateAttributes } from './iterateAttributes';
import { iterateNodes } from './iterateNodes';
import { nodeOps } from 'vue-fusion';

// parse html to HNode
export function parseHtml(html: string) {
    let parent = nodeOps.createElement('view');
    iterateNodes(html, {
        onTagOpen(tag, attributes) {
            const child = nodeOps.createElement(tag);
            child.parentNode = parent;
            iterateAttributes(attributes, {
                onAttribute(name, value) {
                    child.props[name] = value.replace(/&quot;/g, '"');
                },
                onAttributeEnabled(name) {
                    child.props[name] = true;
                }
            })
            parent.children.push(child);
            parent = child;
        },
        onTagClose(tag) {
            parent = parent.parentNode!;
        },
        onText(text) {
            const node = nodeOps.createText(text);
            node.parentNode = parent;
            parent.children.push(node);
        },
        onComment(text) {
            const node = nodeOps.createComment(text);
            node.parentNode = parent;
            parent.children.push(node);
        }
    })
    return parent;
}