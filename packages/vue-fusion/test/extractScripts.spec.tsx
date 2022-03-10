import { extractScripts } from '../src/extractScripts';

test('extractScripts', () => {
    const scripts = extractScripts(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite App</title>
        <!--preload-links-->
        <script type="module" crossorigin src="/assets/index.0cd83429.js"></script>
        <link rel="modulepreload" href="/assets/vendor.458f527c.js">
      </head>
      <body>
        <div id="app"><!--app-html--></div>
    
      </body>
    </html>
    `)
    expect(scripts).toEqual(['/assets/index.0cd83429.js', '/assets/vendor.458f527c.js']);
})