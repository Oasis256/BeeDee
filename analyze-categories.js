import fs from 'fs';

try {
  const data = JSON.parse(fs.readFileSync('all-positions-with-lazy-loading.json', 'utf8'));
  const categories = [...new Set(data.map(item => item.category))];
  
  console.log('Unique categories:', categories);
  console.log('\nCategory counts:');
  categories.forEach(cat => {
    const count = data.filter(item => item.category === cat).length;
    console.log(`  ${cat}: ${count} articles`);
  });
  
  // Check for duplicate category names
  const categoryCounts = {};
  data.forEach(item => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });
  
  console.log('\nDetailed category analysis:');
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count} articles`);
  });
  
} catch (error) {
  console.error('Error:', error.message);
}
