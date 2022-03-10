import * as fs from 'fs';
import * as path from 'path';
import { extractScripts } from "./extractScripts";

export function servePage(renderResult: { mpData: any }, htmlFile: string) {
    const page: Record<string, any> = { ...renderResult };
    if (!page.scripts) {
        page.scripts = {};
    }
    const html = fs.readFileSync(htmlFile, { encoding: 'utf-8'});
    for (const script of extractScripts(html)) {
        const scriptFile = path.join(path.dirname(htmlFile), script);
        const scriptContent = fs.readFileSync(scriptFile, { encoding: 'utf-8'});
        page.scripts[script] = scriptContent;
    }
    return JSON.stringify(page);
}