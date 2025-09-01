import fs from 'fs';

try {
  console.log('🔧 Fixing generic "Sex Positions" category names...');
  
  const data = JSON.parse(fs.readFileSync('all-positions-with-lazy-loading.json', 'utf8'));
  let updatedCount = 0;
  
  data.forEach((article, index) => {
    if (article.category === 'Sex Positions') {
      let newCategory = article.category;
      
      if (article.title.toLowerCase().includes('blow job') || article.title.toLowerCase().includes('oral')) {
        newCategory = 'Oral Positions';
      } else if (article.title.toLowerCase().includes('69') || article.title.toLowerCase().includes('plumber')) {
        newCategory = '69 Positions';
      } else if (article.title.toLowerCase().includes('guide')) {
        newCategory = 'Position Guides';
      } else if (article.title.toLowerCase().includes('eiffel tower')) {
        newCategory = 'Threesome Positions';
      } else if (article.title.toLowerCase().includes('flatiron')) {
        newCategory = 'Advanced Positions';
      } else if (article.title.toLowerCase().includes('rim job')) {
        newCategory = 'Anal Positions';
      } else if (article.title.toLowerCase().includes('bridge')) {
        newCategory = 'Advanced Positions';
      } else if (article.title.toLowerCase().includes('speed bump')) {
        newCategory = 'Advanced Positions';
      } else if (article.title.toLowerCase().includes('pinball wizard')) {
        newCategory = 'Advanced Positions';
      } else if (article.title.toLowerCase().includes('adventurous')) {
        newCategory = 'Adventure Positions';
      } else if (article.title.toLowerCase().includes('foursome')) {
        newCategory = 'Group Positions';
      } else if (article.title.toLowerCase().includes('threesome')) {
        newCategory = 'Threesome Positions';
      } else if (article.title.toLowerCase().includes('side')) {
        newCategory = 'Side Positions';
      } else if (article.title.toLowerCase().includes('behind')) {
        newCategory = 'Behind Positions';
      } else {
        newCategory = 'General Positions';
      }
      
      if (newCategory !== article.category) {
        console.log(`  ${article.title}: "${article.category}" → "${newCategory}"`);
        data[index].category = newCategory;
        updatedCount++;
      }
    }
  });
  
  if (updatedCount > 0) {
    // Save updated data
    fs.writeFileSync('all-positions-with-lazy-loading.json', JSON.stringify(data, null, 2));
    console.log(`\n💾 Updated ${updatedCount} articles`);
    
    // Copy to public folder for frontend
    fs.copyFileSync('all-positions-with-lazy-loading.json', 'public/all-sex-positions.json');
    console.log(`📁 Copied to public/all-sex-positions.json for frontend use`);
    
    // Show new category distribution
    const categories = [...new Set(data.map(item => item.category))];
    console.log('\n📊 New category distribution:');
    categories.forEach(cat => {
      const count = data.filter(item => item.category === cat).length;
      console.log(`  ${cat}: ${count} articles`);
    });
  } else {
    console.log('✅ No categories needed updating');
  }
  
} catch (error) {
  console.error('Error:', error.message);
}
