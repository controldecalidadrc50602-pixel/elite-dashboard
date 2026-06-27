const fs = require('fs');
const path = require('path');

const reactDomPath = path.join(__dirname, '..', 'node_modules', 'react-dom', 'cjs', 'react-dom.production.js');

if (!fs.existsSync(reactDomPath)) {
  console.error('react-dom production file not found at:', reactDomPath);
  process.exit(1);
}

const content = fs.readFileSync(reactDomPath, 'utf8');

// Look for React error messages or search for "310"
// Usually, React production has a function that formats errors:
// formatProdErrorMessage(code, ...) or similar
// Let's search for "310" or "Rendered more hooks" or the error decoder function
const errorDecoderMatch = content.match(/310/);
if (errorDecoderMatch) {
  console.log('Found 310 in react-dom production file. Printing occurrences:');
  let idx = 0;
  while (true) {
    idx = content.indexOf('310', idx);
    if (idx === -1) break;
    console.log(content.substring(idx - 100, idx + 100));
    idx += 3;
  }
} else {
  console.log('No "310" found in react-dom production code.');
}
