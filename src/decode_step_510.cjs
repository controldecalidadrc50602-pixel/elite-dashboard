const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\Marilyn\\.gemini\\antigravity\\brain\\9dbc88a8-7a34-44d0-b4a6-07dda1229c55\\.system_generated\\steps\\510\\content.md';

if (!fs.existsSync(filePath)) {
  console.error('Step 510 content file not found at:', filePath);
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');

// Find the body of the page to find the React Error 310 text
const bodyIndex = content.indexOf('<body');
if (bodyIndex !== -1) {
  // Let's search for the error message description in the HTML
  console.log('--- FOUND BODY ---');
  // Look for React Error Decoder messages
  const errorText = content.match(/Rendered/i) || content.match(/suspended/i) || content.match(/hook/i);
  if (errorText) {
    const startIdx = Math.max(0, content.indexOf(errorText[0]) - 200);
    console.log(content.substring(startIdx, startIdx + 2000));
  } else {
    console.log(content.substring(bodyIndex, bodyIndex + 2000));
  }
} else {
  console.log('Could not find <body> inside the html content.');
}
