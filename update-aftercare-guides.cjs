const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Updating Aftercare Guides...\n');

// Run the scraper
exec('node scrape-aftercare-guides.cjs', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error running scraper:', error);
    return;
  }

  if (stderr) {
    console.error('⚠️ Scraper warnings:', stderr);
  }

  console.log(stdout);

  // Check if the public file was created/updated
  const publicFile = path.join('public', 'aftercare-guides.json');
  if (fs.existsSync(publicFile)) {
    const stats = fs.statSync(publicFile);
    console.log(`\n✅ Aftercare guides updated successfully!`);
    console.log(`📁 File: ${publicFile}`);
    console.log(`📅 Last modified: ${stats.mtime.toLocaleString()}`);
    console.log(`📊 Size: ${(stats.size / 1024).toFixed(2)} KB`);
  } else {
    console.log('\n❌ Failed to create aftercare guides file');
  }
});
