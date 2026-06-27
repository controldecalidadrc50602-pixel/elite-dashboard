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

// Find the definition of function et or et=
const etIndex = fileContent.indexOf('function et(');
if (etIndex !== -1) {
  console.log('--- FOUND function et ---');
  console.log(fileContent.substring(etIndex, etIndex + 500));
} else {
  const etVarIndex = fileContent.indexOf('et=');
  if (etVarIndex !== -1) {
    console.log('--- FOUND et= ---');
    console.log(fileContent.substring(etVarIndex, etVarIndex + 500));
  } else {
    console.log('Could not find et definition in bundle.');
  }
}
