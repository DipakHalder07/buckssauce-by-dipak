const fs = require('fs');

const html = fs.readFileSync('home.html', 'utf8');

// Find start of body
const bodyStart = html.indexOf('<div data-body=true');
const lastScript = html.lastIndexOf('<script');
const rawBody = html.substring(bodyStart, lastScript);

console.log('Raw body length:', rawBody.length);

// Clean SingleFile attributes
let cleaned = rawBody;
cleaned = cleaned.replace(/data-sf-[a-z0-9-]+(=["'][^"']*["'])?/gi, '');
cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

fs.writeFileSync('exact_live_body.html', cleaned);
console.log('Saved exact_live_body.html, length:', cleaned.length);
