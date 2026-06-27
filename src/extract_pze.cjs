const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'dist', 'assets');
const files = fs.readdirSync(filePath);
const jsFile = files.find(f => f.startsWith('index') && f.endsWith('.js'));

if (!jsFile) {
  console.error('No index.*.js file found in dist/assets');
  process.exit(1);
}

const fileContent = fs.readFileSync(path.join(filePath, jsFile), 'utf8');

// Find the definition of function pze
const pzeIndex = fileContent.indexOf('function pze(');
if (pzeIndex !== -1) {
  console.log('--- FOUND function pze ---');
  // Print 1500 characters of its body
  console.log(fileContent.substring(pzeIndex, pzeIndex + 2500));
} else {
  // Try variable pattern: const pze=
  const pzeVarIndex = fileContent.indexOf('pze=');
  if (pzeVarIndex !== -1) {
    console.log('--- FOUND pze= ---');
    console.log(fileContent.substring(pzeVarIndex, pzeVarIndex + 2500));
  } else {
    console.log('Could not find pze definition in bundle.');
  }
}
