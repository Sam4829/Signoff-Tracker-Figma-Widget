const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const isWatch = process.argv.includes('--watch');

// Build options for the widget code (runs in Figma plugin sandbox)
const widgetBuildOptions = {
  entryPoints: ['src/code.tsx'],
  bundle: true,
  outfile: 'dist/code.js',
  target: 'es6',
  platform: 'browser',
  jsxFactory: 'figma.widget.h',
  jsxFragment: 'figma.widget.Fragment',
  logLevel: 'info',
};

// Build options for the Settings popup UI (runs in browser iframe)
const uiBuildOptions = {
  entryPoints: ['src/ui.ts'],
  bundle: true,
  outfile: 'dist/ui.js',
  target: 'es6',
  platform: 'browser',
  tsconfig: 'tsconfig.ui.json',
  logLevel: 'info',
};

// After both builds, assemble dist/ui.html with the JS inlined
function assembleUiHtml() {
  const js = fs.readFileSync(path.join(__dirname, 'dist/ui.js'), 'utf8');
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Widget Settings</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 12px;
      color: #1a1a1a;
      background: #ffffff;
      overflow-x: hidden;
    }
  </style>
</head>
<body>
  <div id="app"></div>
  <script>${js}</script>
</body>
</html>`;
  fs.writeFileSync(path.join(__dirname, 'dist/ui.html'), html, 'utf8');
  console.log('dist/ui.html assembled successfully.');
}

if (isWatch) {
  Promise.all([
    esbuild.context(widgetBuildOptions),
    esbuild.context(uiBuildOptions),
  ]).then(([widgetCtx, uiCtx]) => {
    console.log('Watching for changes in src/...');
    widgetCtx.watch();
    uiCtx.watch();
    // Note: assembleUiHtml runs once on start in watch mode
    assembleUiHtml();
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
} else {
  Promise.all([
    esbuild.build(widgetBuildOptions),
    esbuild.build(uiBuildOptions),
  ]).then(() => {
    assembleUiHtml();
    console.log('Build completed successfully.');
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
