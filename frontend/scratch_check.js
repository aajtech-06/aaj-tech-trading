/* eslint-disable */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'layout', 'Navbar.tsx');
const content = fs.readFileSync(filePath, 'utf8');

try {
  // Let's count braces, brackets, and parentheses
  let braces = 0;
  let brackets = 0;
  let parens = 0;
  let lineNum = 1;
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '\n') {
      lineNum++;
    }

    if (inString) {
      if (char === '\\') {
        i++; // skip next char
        continue;
      }
      if (char === stringChar) {
        inString = false;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = true;
      stringChar = char;
      continue;
    }

    // skip comments
    if (char === '/' && nextChar === '/') {
      while (i < content.length && content[i] !== '\n') {
        i++;
      }
      lineNum++;
      continue;
    }
    if (char === '/' && nextChar === '*') {
      i += 2;
      while (i < content.length && !(content[i] === '*' && content[i + 1] === '/')) {
        if (content[i] === '\n') lineNum++;
        i++;
      }
      i++;
      continue;
    }

    if (char === '{') braces++;
    if (char === '}') braces--;
    if (char === '[') brackets++;
    if (char === ']') brackets--;
    if (char === '(') parens++;
    if (char === ')') parens--;

    if (braces < 0) {
      console.log(`Extra closing brace } at line ${lineNum}`);
      braces = 0;
    }
    if (brackets < 0) {
      console.log(`Extra closing bracket ] at line ${lineNum}`);
      brackets = 0;
    }
    if (parens < 0) {
      console.log(`Extra closing parenthesis ) at line ${lineNum}`);
      parens = 0;
    }
  }

  console.log(`End of file check: braces=${braces}, brackets=${brackets}, parens=${parens}`);
} catch (e) {
  console.error(e);
}
