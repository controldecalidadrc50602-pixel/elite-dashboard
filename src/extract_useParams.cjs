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

// Let's search for useParams usage in react-router-dom
const upIndex = fileContent.indexOf('useParams');
if (upIndex !== -1) {
  console.log('--- FOUND useParams ---');
  console.log(fileContent.substring(upIndex - 200, upIndex + 200));
} else {
  console.log('useParams not found in bundle.');
}
