const fs = require('fs');
const text = fs.readFileSync('exact_chunk_5743.js', 'utf8');

// Search for .lottie or .json
const lottieMatches = text.match(/[\w\-./\\]+\.(lottie|json)/gi) || [];
console.log('Lottie files:', [...new Set(lottieMatches)]);

// Search for URLs or asset paths in the chunk
const assetMatches = text.match(/https?:\/\/[^\s"'`)]+|[\w\-_/]+\.lottie/gi) || [];
console.log('Asset matches:', [...new Set(assetMatches)].slice(0, 30));
