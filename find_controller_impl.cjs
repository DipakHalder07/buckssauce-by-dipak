const fs = require('fs');
const text = fs.readFileSync('exact_chunk_5743.js', 'utf8');

const idx = text.indexOf('registerParallaxFoodController:');
if (idx !== -1) {
  console.log(text.slice(idx - 100, idx + 500));
} else {
  const idx2 = text.indexOf('registerParallaxFoodController');
  console.log('Alternate search:', text.slice(idx2 - 100, idx2 + 500));
}
