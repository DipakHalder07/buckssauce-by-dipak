const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// .lottie files are zip files!
const buf = fs.readFileSync('public/lotties/cool.lottie');
console.log('cool.lottie magic header:', buf.slice(0, 4).toString()); // Should be 'PK\x03\x04' for zip

// Let's use adm-zip or unzip if available or inspect
