const fs = require('fs');
const cheerio = require('cheerio');

const live$ = cheerio.load(fs.readFileSync('live_loader_svg.html', 'utf8'));
const local$ = cheerio.load(fs.readFileSync('local_loader_svg.html', 'utf8'));

console.log('--- Groups in Live SVG ---');
live$('g[id]').each((i, el) => console.log('Live g:', live$(el).attr('id'), 'style:', live$(el).attr('style')));

console.log('--- Groups in Local SVG ---');
local$('g[id]').each((i, el) => console.log('Local g:', local$(el).attr('id'), 'style:', local$(el).attr('style')));
