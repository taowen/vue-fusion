// simplified from https://github.com/developit/htmlParser/blob/master/src/htmlParser.js
const attrTokenizer = /([a-zA-Z0-9_\:\-]*)\s*=\s*"(.*?)"\s*/gm;

export function iterateAttributes(html: string, callbacks: {
    onAttribute(name: string, value: string): void;
    onAttributeEnabled(name: string): void;
}) {
    attrTokenizer.lastIndex = 0;
    let token: RegExpExecArray | null = null;
    let lastIndex = 0;
    while (token = attrTokenizer.exec(html)) {
        const attrBeginIndex = attrTokenizer.lastIndex - token[0].length;
        if (attrBeginIndex > lastIndex) {
            const name = html.substring(lastIndex, attrBeginIndex).trim();
            if (name) {
                callbacks.onAttributeEnabled(name);
            }
        }
        callbacks.onAttribute(token[1], token[2]);
        lastIndex = attrTokenizer.lastIndex;
    }
    if (html.length > lastIndex) {
        const name = html.substring(lastIndex).trim();
        if (name) {
            callbacks.onAttributeEnabled(name);
        }
    }
}