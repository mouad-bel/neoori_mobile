const fs = require('fs');
const path = require('path');

const htmlFile = path.join(__dirname, '../assets/games/couch2048-bundle.html');
const outputFile = path.join(__dirname, '../src/games/couch2048-html.ts');

const html = fs.readFileSync(htmlFile, 'utf8');

// Échapper les backticks et les ${} pour les template literals
const escapedHtml = html
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\${/g, '\\${');

const tsContent = `// Auto-generated file - do not edit manually
// Generated from: assets/games/couch2048-bundle.html

export const COUCH2048_HTML = \`${escapedHtml}\`;
`;

fs.writeFileSync(outputFile, tsContent, 'utf8');
console.log('✅ TypeScript file created:', outputFile);

