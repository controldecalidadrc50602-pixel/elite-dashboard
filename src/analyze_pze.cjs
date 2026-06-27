const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'dist', 'assets');
const files = fs.readdirSync(filePath);
const jsFile = files.find(f => f.startsWith('index') && f.endsWith('.js'));

if (!jsFile) {
  console.error('No index.*.js file found');
  process.exit(1);
}

const content = fs.readFileSync(path.join(filePath, jsFile), 'utf8');

// Find pze definition and dump the 500 characters before it to see imports/variables
const pzeIndex = content.indexOf('pze=');
if (pzeIndex !== -1) {
  console.log('--- BEFORE pze ---');
  console.log(content.substring(pzeIndex - 600, pzeIndex));
} else {
  console.log('Could not find pze=');
}
