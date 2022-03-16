import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';

const textEncoder = new TextEncoder();

export function packDir(dir: string) {
    const bufs = [];
    let totalSize = 0;
    for (const file of fs.readdirSync(dir)) {
        let buf = [];
        for (const b of textEncoder.encode(file)) {
            buf.push(b.toString(16).padStart(2, '0'))
        }
        buf.push('00');
        totalSize += buf.length;
        bufs.push(buf);
        buf = [];
        for (const b of fs.readFileSync(path.join(dir, file))) {
            buf.push(b.toString(16).padStart(2, '0'))
        }
        buf.push('00');
        bufs.push(buf);
        totalSize += buf.length;
    }    
    const lines = [`(module`];
    lines.push(`(memory (export "packed") ${1 + Math.floor(totalSize / 65536)})`)
    let offset = 0;
    for (const buf of bufs) {
        lines.push(`(data (i32.const 0x${offset.toString(16)}) "\\${buf.join('\\')}")`)
        offset += buf.length;
    }
    lines.push(`)`)
    fs.writeFileSync('/tmp/packed.wat', lines.join('\n'));
    childProcess.execSync('wat2wasm /tmp/packed.wat -o /tmp/packed.wasm');
    childProcess.execSync('brotli -f /tmp/packed.wasm');
}

