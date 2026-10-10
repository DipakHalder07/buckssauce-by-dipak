const fs = require('fs');
const cheerio = require('cheerio');

const originalHtml = fs.readFileSync('home.html', 'utf8');

// Load into cheerio
const $ = cheerio.load(originalHtml);

// Remove SingleFile nesting tracking scripts or attributes
$('[data-sf-nesting-track-id]').removeAttr('data-sf-nesting-track-id');
$('script').each((i, el) => {
  const text = $(el).text();
  if (text.includes('data-sf-nesting-track-id')) {
    $(el).remove();
  }
});

// Remove any existing script tags that were SingleFile stubs
$('script:empty').remove();

// Make sure body has pointer-events: auto and opacity: 1
$('body').attr('style', 'pointer-events: auto; opacity: 1;');

// Append our interactive bundle script
$('body').append('<script type="module" src="/src/interactive.js"></script>');

// Serialize back to clean HTML
const formattedHtml = $.html();

fs.writeFileSync('index.html', formattedHtml);
console.log('Formatted index.html with Cheerio! Valid HTML, size:', formattedHtml.length);
