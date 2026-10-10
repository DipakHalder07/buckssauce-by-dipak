const fs = require('fs');

const originalHtml = fs.readFileSync('home.html', 'utf8');

// Extract the <style> tags from home.html
const styleMatches = originalHtml.match(/<style[\s\S]*?<\/style>/gi) || [];
const allStyles = styleMatches.join('\n');

// Extract exact body
const bodyContent = fs.readFileSync('exact_live_body.html', 'utf8');

const fullPage = `<!DOCTYPE html>
<html lang="en" class="inter_tight_1f550e88-module__8l2g-W__variable peperoncinosanscustom_9a6eeacd-module__106iUW__variable lenis lenis-scrolling" style="--color-theme: var(--color-foreground);">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Bucks Sauce - Best Small-Batch BBQ Sauce | Gourmet, No HFCS | Bucks Sauce</title>
  <meta name="description" content="Shop small-batch BBQ sauce made with real ingredients. No high fructose corn syrup, no seed oils, no additives. Sweet heat with a balanced finish. Premium BBQ sauce built to perform.">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  ${allStyles}
</head>
<body class="will-change-opacity" style="pointer-events: auto; opacity: 1;">
  ${bodyContent}
  <script type="module" src="/src/interactive.js"></script>
</body>
</html>
`;

fs.writeFileSync('index.html', fullPage);
console.log('Generated index.html with exact live site markup and styles!');
