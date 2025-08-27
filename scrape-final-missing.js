import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapeFinalMissing() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Focus on categories that are missing positions
  const missingCategories = [
    { url: 'https://www.cosmopolitan.com/sex-love/g4967/oral-sex-positions-you-need/', category: 'Oral Positions', expectedCount: 38, currentCount: 23, missing: 15 },
    { url: 'https://www.cosmopolitan.com/sex-love/positions/g4090/mind-blowing-lesbian-sex-positions/', category: 'Lesbian Positions', expectedCount: 40, currentCount: 26, missing: 14 },
    { url: 'https://www.cosmopolitan.com/sex-love/positions/g5025/anal-sex-positions/', category: 'Anal Positions', expectedCount: 27, currentCount: 25, missing: 2 },
    { url: 'https://www.cosmopolitan.com/sex-love/positions/g2064/romantic-sex-positions/', category: 'Romantic Positions', expectedCount: 33, currentCount: 32, missing: 1 },
    { url: 'https://www.cosmopolitan.com/sex-love/positions/g5727/masturbation-positions-for-women/', category: 'Solo Positions', expectedCount: 25, currentCount: 24, missing: 1 }
  ];

  try {
    for (const category of missingCategories) {
      console.log(`\n🎯 TARGETING MISSING: ${category.category}`);
      console.log(`Missing: ${category.missing} positions`);
      
      try {
        await page.goto(category.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 15000));

        const missingData = await page.evaluate((categoryInfo) => {
          const data = {
            category: categoryInfo.category,
            missingPositions: [],
            allText: [],
            allElements: []
          };

          // Get ALL text content from the page
          const allText = document.body.textContent;
          data.allText = allText;

          // Get ALL elements and their text
          const allElements = Array.from(document.querySelectorAll('*'));
          data.allElements = allElements.map(el => ({
            tagName: el.tagName,
            text: el.textContent.trim(),
            className: el.className,
            id: el.id
          })).filter(item => item.text.length > 3 && item.text.length < 200);

          // AGGRESSIVE POSITION DETECTION
          const foundPositions = new Set();

          // Method 1: Look for any text that could be a position name
          const positionPatterns = [
            /The\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g,
            /\d+\.\s*([A-Z][^.!?]+)/g,
            /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Position|Pose|Style|Technique))/g
          ];

          positionPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(allText)) !== null) {
              const text = match[0] || match[1];
              if (text && text.length > 3 && text.length < 100) {
                foundPositions.add(text.trim());
              }
            }
          });

          // Method 2: Look for specific position keywords in any text
          const positionKeywords = [
            'bend', 'slap', 'vibrator', 'face', 'booty', 'novelist', 'sensation',
            'vanilla', 'sideways', 'chin', 'dildo', 'tantric', 'flow', 'facetime',
            'double', 'knees', 'seated', 'housebound', 'romantic', 'deep', 'first',
            'press', 'spread', 'buzzy', 'hump', 'grind', 'electric', 'squatter',
            'downward', 'dog', 'cheeky', 'monkey', 'headbutt', 'can', 'opener',
            'boss', 'easy', 'menage', 'dinner', 'served', 'assisted', 'hot',
            'cold', 'amazonian', 'adventure', 'slider', 'made', 'order', 'lap',
            'dance', 'greasy', 'spoon', 'starter', 'rated', 'see', 'saw', 'serving',
            'big', 'reveal', 'sideways', 'tango', 'princess', 'grind', 'plus',
            'wet', 'sesh', 'drive', 'crazy', 'travel', 'size', 'speed', 'bump',
            'wheelbarrow', 'titanic', 'couch', 'worship', 'sit', 'get', 'oral',
            'missionary', 'anal', 'lesbian', 'masturbation', 'penetration'
          ];

          // Look for any text containing these keywords
          const lines = allText.split('\n');
          lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.length > 5 && trimmedLine.length < 100) {
              const lowerLine = trimmedLine.toLowerCase();
              if (positionKeywords.some(keyword => lowerLine.includes(keyword))) {
                foundPositions.add(trimmedLine);
              }
            }
          });

          // Method 3: Look for any element that starts with "The" and has position-like content
          allElements.forEach(element => {
            const text = element.text;
            if (text && text.startsWith('The ') && text.length > 5 && text.length < 100) {
              const lowerText = text.toLowerCase();
              if (positionKeywords.some(keyword => lowerText.includes(keyword))) {
                foundPositions.add(text);
              }
            }
          });

          // Method 4: Look for numbered lists
          const numberedMatches = allText.match(/\d+\.\s*([A-Z][^.!?]+)/g);
          if (numberedMatches) {
            numberedMatches.forEach(match => {
              const cleanMatch = match.replace(/^\d+\.\s*/, '').trim();
              if (cleanMatch.length > 3 && cleanMatch.length < 100) {
                foundPositions.add(cleanMatch);
              }
            });
          }

          // Method 5: Look for any text that looks like a position name
          const potentialPositionNames = allText.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g);
          if (potentialPositionNames) {
            potentialPositionNames.forEach(name => {
              if (name.length > 3 && name.length < 50) {
                const lowerName = name.toLowerCase();
                if (positionKeywords.some(keyword => lowerName.includes(keyword))) {
                  foundPositions.add(name);
                }
              }
            });
          }

          data.missingPositions = Array.from(foundPositions);

          return data;
        }, category);

        console.log(`📊 Found ${missingData.missingPositions.length} potential missing positions`);
        console.log(`📝 Total text elements analyzed: ${missingData.allElements.length}`);
        
        // Show the found positions
        console.log(`🔍 Potential missing positions:`);
        missingData.missingPositions.slice(0, 10).forEach((pos, index) => {
          console.log(`   ${index + 1}. ${pos}`);
        });

        // Save individual analysis
        fs.writeFileSync(`${category.category.toLowerCase().replace(/\s+/g, '-')}-missing-analysis.json`, JSON.stringify(missingData, null, 2));

      } catch (error) {
        console.error(`❌ Error analyzing ${category.url}:`, error.message);
      }
    }

    console.log(`\n🎉 Missing position analysis completed!`);
    console.log(`📁 Individual analysis files saved for each category`);

  } catch (error) {
    console.error('Error during missing position analysis:', error);
  } finally {
    await browser.close();
  }
}

// Run the missing position analysis
scrapeFinalMissing();
