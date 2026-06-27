const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'dist', 'assets');
const files = fs.readdirSync(filePath);
const jsFile = files.find(f => f.startsWith('index') && f.endsWith('.js'));

if (!jsFile) {
  console.error('No index.*.js file found in dist/assets');
  process.exit(1);
}

const fileContent = fs.readFileSync(path.join(filePath, jsFile), 'utf8');

// Let's find occurrences of LRe or see what is around the BUILD_VERSION log
const versionIndex = fileContent.indexOf('BUILD_VERSION_5.0_STABLE');
if (versionIndex !== -1) {
  console.log('--- FOUND VERSION STRING ---');
  console.log(fileContent.substring(versionIndex - 300, versionIndex + 300));
} else {
  console.log('BUILD_VERSION_5.0_STABLE not found in the minified JS.');
}

// Let's search for "Rendered more hooks" to double check
console.log('File size:', fileContent.length, 'bytes');
