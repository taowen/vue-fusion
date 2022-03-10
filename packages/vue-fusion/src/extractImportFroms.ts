// import {a, b} from 'xxx'
const re1 = /import\s+\{[\w\s,]*\}\sfrom\s+['"]([\w-]+)['"]/g;
// import 'xxx'
const re2 = /import\s+['"]([\w-]+)['"]/g;
// import ab from 'xxx'
const re3 = /import\s+\w+\s+from\s+['"]([\w-]+)['"]/g
// import * as ab from 'xxx'
const re4 = /import\s+\*\s+as\s+\w+\s+from\s+['"]([\w-]+)['"]/g
const res = [re1, re2, re3, re4];

export function* extractImportFroms(script: string) {
    for (const re of res) {
        for (const match of script.matchAll(re)) {
            yield match[1];
        }
    }
}