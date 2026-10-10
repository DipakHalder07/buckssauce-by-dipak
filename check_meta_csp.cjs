const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

$('meta').each((i, el) => {
  console.log(`Meta ${i}: http-equiv="${$(el).attr('http-equiv')}" name="${$(el).attr('name')}" content="${$(el).attr('content')?.substring(0, 100)}"`);
});

$('base').each((i, el) => {
  console.log(`Base: href="${$(el).attr('href')}"`);
});
