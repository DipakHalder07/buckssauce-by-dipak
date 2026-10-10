const fs = require('fs');
const samples = JSON.parse(fs.readFileSync('loader_animation_samples.json', 'utf8'));

[0, 4, 8, 12, 16, 20, 24].forEach(idx => {
  const s = samples[idx];
  if (!s) return;
  console.log(`=== Sample ${s.id} (time: ${s.time}ms) ===`);
  console.log('Loader opacity:', s.value?.loaderOpacity);
  console.log('Logo:', s.value?.logo);
  console.log('Circles:');
  (s.value?.circles || []).forEach((c, i) => {
    console.log(`  Circle ${i}: transform="${c.transform}"`);
  });
  console.log('Foods:');
  (s.value?.foods || []).forEach((f, i) => {
    console.log(`  Food ${i}: transform="${f.transform}" opacity="${f.opacity}"`);
  });
});
