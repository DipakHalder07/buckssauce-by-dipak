const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('index.html', 'utf8'));

const sec4 = $('[data-why-bucks-sauce]');
console.log('Sec 4 reasons styles:');
sec4.find('[data-reason]').each((i, el) => {
  console.log(`Reason ${i}: class="${$(el).attr('class')}" style="${$(el).attr('style')}"`);
});
console.log('Sec 4 dial container:', sec4.find('.relative.h-\\[60vh\\].lg\\:h-\\[75vh\\]').attr('class'));
console.log('Sec 4 dial container style:', sec4.find('.relative.h-\\[60vh\\].lg\\:h-\\[75vh\\]').attr('style'));
