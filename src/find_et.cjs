const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'dist', 'assets');
const files = fs.readdirSync(filePath);
const jsFile = files.find(f => f.startsWith('index') && f.endsWith('.js'));

if (!jsFile) {
  process.exit(1);
}

const content = fs.readFileSync(path.join(filePath, jsFile), 'utf8');

// Find all matches of "et=" or "function et" or "et as" or similar
const regexes = [
  /function et\(/g,
  /\bet\s*=\s*/g,
  /\buseParams\b/g
];

regexes.forEach((regex) => {
  console.log('Searching for:', regex);
  let match;
  let count = 0;
  while ((match = regex.exec(content)) !== null) {
    count++;
    if (count <= 10) {
      console.log(`Match ${count} at index ${match.index}:`);
      console.log(content.substring(Math.max(0, match.index - 100), Math.min(content.length, match.index + 200)));
    }
  }
  console.log(`Total matches for ${regex}: ${count}\n`);
});
