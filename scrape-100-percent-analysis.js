import puppeteer from 'puppeteer';
import fs from 'fs';

async function analyzeFor100Percent() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set user agent to avoid detection
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const analysisResults = [];

  // URLs to analyze
  const positionUrls = [
    {
      url: 'https://www.cosmopolitan.com/sex-love/g4967/oral-sex-positions-you-need/',
      category: 'Oral Positions',
      expectedCount: 38
    },
    {
      url: 'https://www.cosmopolitan.com/sex-love/positions/g63107690/missionary-sex-positions-list/',
      category: 'Missionary Variations',
      expectedCount: 22
    },
    {
      url: 'https://www.cosmopolitan.com/sex-love/positions/g5025/anal-sex-positions/',
      category: 'Anal Positions',
      expectedCount: 27
    },
    {
      url: 'https://www.cosmopolitan.com/sex-love/positions/g38819444/best-chair-sex-positions/',
      category: 'Chair Positions',
      expectedCount: 12
    },
    {
      url: 'https://www.cosmopolitan.com/sex-love/positions/g4090/mind-blowing-lesbian-sex-positions/',
      category: 'Lesbian Positions',
      expectedCount: 40
    },
    {
      url: 'https://www.cosmopolitan.com/sex-love/positions/news/g5949/first-time-sex-positions/',
      category: 'Beginner Positions',
      expectedCount: 20
    },
    {
      url: 'https://www.cosmopolitan.com/sex-love/positions/g2064/romantic-sex-positions/',
      category: 'Romantic Positions',
      expectedCount: 33
    },
    {
      url: 'https://www.cosmopolitan.com/sex-love/positions/g5727/masturbation-positions-for-women/',
      category: 'Solo Positions',
      expectedCount: 25
    },
    {
      url: 'https://www.cosmopolitan.com/sex-love/positions/g6018/sex-positions-deep-penetration/',
      category: 'Deep Penetration',
      expectedCount: 20
    }
  ];

  try {
    for (const position of positionUrls) {
      console.log(`\n🔍 ANALYZING: ${position.category}`);
      console.log(`Expected: ${position.expectedCount} positions`);
      
      try {
        await page.goto(position.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 10000));

        const analysis = await page.evaluate((categoryInfo) => {
          const result = {
            category: categoryInfo.category,
            expectedCount: categoryInfo.expectedCount,
            url: categoryInfo.url,
            title: document.title,
            analysis: {
              allHeadings: [],
              numberedPatterns: [],
              positionKeywords: [],
              allText: [],
              allImages: [],
              potentialPositions: [],
              missingPositions: []
            }
          };

          // Get ALL headings
          const allHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
          result.analysis.allHeadings = allHeadings.map((heading, index) => ({
            index,
            tag: heading.tagName,
            text: heading.textContent.trim(),
            className: heading.className,
            id: heading.id,
            position: heading.getBoundingClientRect()
          }));

          // Look for numbered patterns in text
          const allText = document.body.textContent;
          const numberMatches = allText.match(/\d+\.\s+[A-Z][^.!?]+/g);
          if (numberMatches) {
            result.analysis.numberedPatterns = numberMatches.map(match => match.trim());
          }

          // Look for position keywords in headings
          const positionKeywords = [
            'position', 'pose', 'style', 'technique', 'method', 'way', 'variation',
            'missionary', 'doggy', 'cowgirl', 'reverse', 'standing', 'sitting',
            'oral', 'anal', 'penetration', 'stimulation', 'pleasure', 'sex',
            'bend', 'slap', 'vibrator', 'face', 'booty', 'novelist', 'sensation',
            'vanilla', 'sideways', 'chin', 'dildo', 'tantric', 'flow', 'facetime',
            'double', 'knees', 'seated', 'housebound', 'romantic', 'deep', 'first'
          ];

          allHeadings.forEach(heading => {
            const text = heading.textContent.toLowerCase();
            if (positionKeywords.some(keyword => text.includes(keyword))) {
              result.analysis.positionKeywords.push({
                text: heading.textContent.trim(),
                tag: heading.tagName,
                className: heading.className
              });
            }
          });

          // Get all text content for analysis
          const allParagraphs = Array.from(document.querySelectorAll('p, div, li'));
          result.analysis.allText = allParagraphs
            .map(el => el.textContent.trim())
            .filter(text => text.length > 10 && text.length < 500)
            .slice(0, 100); // Limit to first 100 for analysis

          // Get all images
          const allImages = Array.from(document.querySelectorAll('img')).map(img => ({
            src: img.src,
            alt: img.alt || '',
            width: img.width,
            height: img.height
          })).filter(img => 
            img.src && 
            !img.src.includes('logo') && 
            !img.src.includes('ad') && 
            img.width > 100 && 
            img.height > 100
          );
          result.analysis.allImages = allImages;

          // Try to identify potential positions using multiple methods
          const potentialPositions = new Set();

          // Method 1: All headings that might be positions
          allHeadings.forEach(heading => {
            const text = heading.textContent.trim();
            if (text && 
                !text.includes('Sex Positions') && 
                !text.includes('Oral Sex') &&
                !text.includes('Missionary') &&
                !text.includes('Anal Sex') &&
                !text.includes('Chair Sex') &&
                !text.includes('Lesbian Sex') &&
                !text.includes('First-Time') &&
                !text.includes('Romantic Sex') &&
                !text.includes('Masturbation') &&
                !text.includes('Deep Penetration') &&
                !text.includes('Advertisement') &&
                !text.includes('Related') &&
                !text.includes('More') &&
                !text.includes('Read') &&
                !text.includes('Follow') &&
                !text.includes('Subscribe') &&
                !text.includes('Newsletter') &&
                text.length > 3 && 
                text.length < 100) {
              potentialPositions.add(text);
            }
          });

          // Method 2: Numbered patterns
          result.analysis.numberedPatterns.forEach(pattern => {
            potentialPositions.add(pattern);
          });

          // Method 3: Position keywords
          result.analysis.positionKeywords.forEach(item => {
            potentialPositions.add(item.text);
          });

          result.analysis.potentialPositions = Array.from(potentialPositions);

          // Calculate missing positions
          const foundCount = result.analysis.potentialPositions.length;
          const missingCount = categoryInfo.expectedCount - foundCount;
          
          if (missingCount > 0) {
            result.analysis.missingPositions = {
              expected: categoryInfo.expectedCount,
              found: foundCount,
              missing: missingCount,
              successRate: ((foundCount / categoryInfo.expectedCount) * 100).toFixed(1) + '%'
            };
          }

          return result;
        }, position);

        analysisResults.push(analysis);

        console.log(`📊 Analysis Results:`);
        console.log(`   Found ${analysis.analysis.potentialPositions.length} potential positions`);
        console.log(`   All headings: ${analysis.analysis.allHeadings.length}`);
        console.log(`   Numbered patterns: ${analysis.analysis.numberedPatterns.length}`);
        console.log(`   Position keywords: ${analysis.analysis.positionKeywords.length}`);
        console.log(`   Images: ${analysis.analysis.allImages.length}`);
        
        if (analysis.analysis.missingPositions) {
          console.log(`   ❌ MISSING: ${analysis.analysis.missingPositions.missing} positions`);
          console.log(`   Success Rate: ${analysis.analysis.missingPositions.successRate}`);
        } else {
          console.log(`   ✅ SUCCESS: All positions found!`);
        }

        // Show first few potential positions
        console.log(`   Sample positions found:`);
        analysis.analysis.potentialPositions.slice(0, 5).forEach((pos, index) => {
          console.log(`     ${index + 1}. ${pos}`);
        });

      } catch (error) {
        console.error(`❌ Error analyzing ${position.url}:`, error.message);
        analysisResults.push({
          category: position.category,
          expectedCount: position.expectedCount,
          url: position.url,
          error: error.message
        });
      }
    }

    // Save the comprehensive analysis
    fs.writeFileSync('100-percent-analysis.json', JSON.stringify(analysisResults, null, 2));
    console.log(`\n🎉 Analysis saved to 100-percent-analysis.json`);

    // Print summary
    console.log('\n📊 ANALYSIS SUMMARY:');
    let totalExpected = 0;
    let totalFound = 0;
    
    analysisResults.forEach((result, index) => {
      if (result.error) {
        console.log(`${index + 1}. ${result.category}: ERROR - ${result.error}`);
      } else {
        const found = result.analysis.potentialPositions.length;
        const expected = result.expectedCount;
        const successRate = ((found / expected) * 100).toFixed(1);
        
        totalExpected += expected;
        totalFound += found;
        
        console.log(`${index + 1}. ${result.category}: ${found}/${expected} (${successRate}%)`);
        
        if (result.analysis.missingPositions) {
          console.log(`   ❌ Missing ${result.analysis.missingPositions.missing} positions`);
        }
      }
    });

    const overallSuccessRate = ((totalFound / totalExpected) * 100).toFixed(1);
    console.log(`\n🎯 OVERALL: ${totalFound}/${totalExpected} (${overallSuccessRate}%)`);
    console.log(`📁 Detailed analysis saved to: 100-percent-analysis.json`);

  } catch (error) {
    console.error('Error during analysis:', error);
  } finally {
    await browser.close();
  }
}

// Run the analysis
analyzeFor100Percent();
