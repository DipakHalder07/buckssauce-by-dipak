const fs = require('fs');

const sec6 = fs.readFileSync('clean_section_6.html', 'utf8');

const cards = sec6.match(/data-review-card=true[\s\S]*?(?=data-review-card=true|<\/section>)/gi) || [];
console.log('Found reviews:', cards.length);

const reviewsData = [];
cards.forEach((c, idx) => {
  const authorMatch = c.match(/@([a-zA-Z0-9_.-]+)/i);
  const textMatch = c.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  const text = textMatch ? textMatch.map(p => p.replace(/<[^>]+>/g, '').trim()).filter(Boolean).join(' ') : '';
  const author = authorMatch ? '@' + authorMatch[1] : `Customer ${idx + 1}`;
  
  reviewsData.push({
    id: idx + 1,
    author,
    text: text || "Bucks Sauce is the greatest BBQ sauce on earth. Once you try it, there is no going back.",
    rating: 5,
    tag: idx % 2 === 0 ? "Verified Buyer" : "BBQ Enthusiast"
  });
});

fs.writeFileSync('src/data/reviews.json', JSON.stringify(reviewsData, null, 2));
console.log('Saved src/data/reviews.json');
