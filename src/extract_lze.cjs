const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'dist', 'assets');
const files = fs.readdirSync(filePath);
const jsFile = files.find(f => f.startsWith('index') && f.endsWith('.js'));

if (!jsFile) {
  process.exit(1);
}

const content = fs.readFileSync(path.join(filePath, jsFile), 'utf8');

// Find definition of lze
const lzeIndex = content.indexOf('lze=');
if (lzeIndex !== -1) {
  console.log('--- FOUND lze= ---');
  console.log(content.substring(lzeIndex, lzeIndex + 1500));
} else {
  // Check if lze is defined as function lze
  const lzeFuncIndex = content.indexOf('function lze(');
  if (lzeFuncIndex !== -1) {
    console.log('--- FOUND function lze ---');
    console.log(content.substring(lzeFuncIndex, lzeFuncIndex + 1500));
  } else {
    console.log('Could not find lze definition in bundle.');
  }
}
