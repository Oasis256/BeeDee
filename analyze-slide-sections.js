import puppeteer from 'puppeteer';
import fs from 'fs';

async function analyzeSlideSections() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const analysisResults = [];

  const positionUrls = [
    { url: 'https://www.cosmopolitan.com/sex-love/g4967/oral-sex-positions-you-need/', category: 'Oral Positions', expectedCount: 38 },
    { url: 'https://www.cosmopolitan.com/sex-love/positions/g63107690/missionary-sex-positions-list/', category: 'Missionary Variations', expectedCount: 22 },
    { url: 'https://www.cosmopolitan.com/sex-love/positions/g5025/anal-sex-positions/', category: 'Anal Positions', expectedCount: 27 },
    { url: 'https://www.cosmopolitan.com/sex-love/positions/g38819444/best-chair-sex-positions/', category: 'Chair Positions', expectedCount: 12 },
    { url: 'https://www.cosmopolitan.com/sex-love/positions/g4090/mind-blowing-lesbian-sex-positions/', category: 'Lesbian Positions', expectedCount: 40 },
    { url: 'https://www.cosmopolitan.com/sex-love/positions/news/g5949/first-time-sex-positions/', category: 'Beginner Positions', expectedCount: 20 },
    { url: 'https://www.cosmopolitan.com/sex-love/positions/g2064/romantic-sex-positions/', category: 'Romantic Positions', expectedCount: 33 },
    { url: 'https://www.cosmopolitan.com/sex-love/positions/g5727/masturbation-positions-for-women/', category: 'Solo Positions', expectedCount: 25 },
    { url: 'https://www.cosmopolitan.com/sex-love/positions/g6018/sex-positions-deep-penetration/', category: 'Deep Penetration', expectedCount: 20 }
  ];

  try {
    for (const position of positionUrls) {
      console.log(`\n🔍 ANALYZING SLIDE SECTIONS: ${position.category}`);
      console.log(`Expected: ${position.expectedCount} positions`);
      
      try {
        await page.goto(position.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 15000));

        const analysis = await page.evaluate((categoryInfo) => {
          const result = {
            category: categoryInfo.category,
            expectedCount: categoryInfo.expectedCount,
            url: categoryInfo.url,
            title: document.title,
            slideAnalysis: {
              allSlideSections: [],
              slideSectionsWithContent: [],
              slideSectionsWithoutContent: [],
              potentialPositions: [],
              allHeadings: []
            }
          };

          // Find all slide sections
          const slideSections = Array.from(document.querySelectorAll('section[id^="slide-"]'));
          
          result.slideAnalysis.allSlideSections = slideSections.map(section => ({
            id: section.id,
            className: section.className,
            children: section.children.length,
            textContent: section.textContent.substring(0, 200) + '...',
            hasImages: section.querySelectorAll('img').length > 0,
            hasHeadings: section.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0,
            hasParagraphs: section.querySelectorAll('p').length > 0
          }));

          // Analyze each slide section
          slideSections.forEach((section, index) => {
            let hasContent = false;
            let positionTitle = '';
            let description = '';
            let foundImages = [];

            // Look for position title
            const titleElements = section.querySelectorAll('h1, h2, h3, h4, h5, h6, strong, b');
            for (const titleEl of titleElements) {
              const text = titleEl.textContent.trim();
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
                  !text.includes('Tips') &&
                  !text.includes('Guide') &&
                  !text.includes('Expert') &&
                  text.length > 3 && 
                  text.length < 150) {
                positionTitle = text;
                hasContent = true;
                break;
              }
            }

            // Look for numbered patterns
            if (!positionTitle) {
              const allText = section.textContent;
              const numberMatches = allText.match(/\d+\.\s+([A-Z][^.!?]+)/g);
              if (numberMatches && numberMatches.length > 0) {
                positionTitle = numberMatches[0].replace(/^\d+\.\s*/, '').trim();
                hasContent = true;
              }
            }

            // Look for images
            const images = Array.from(section.querySelectorAll('img')).map(img => ({
              src: img.src,
              alt: img.alt || '',
              width: img.width,
              height: img.height
            })).filter(img => 
              img.src && 
              !img.src.includes('logo') && 
              !img.src.includes('ad') && 
              !img.src.includes('icon') &&
              !img.src.includes('search') &&
              !img.src.includes('close') &&
              img.width > 100 && 
              img.height > 100
            );

            if (images.length > 0) {
              foundImages = images;
              hasContent = true;
            }

            // Look for description
            const paragraphs = Array.from(section.querySelectorAll('p'));
            const allText = [];
            
            paragraphs.forEach(p => {
              const text = p.textContent.trim();
              if (text.length > 10 && text.length < 1000) {
                allText.push(text);
                hasContent = true;
              }
            });

            if (allText.length > 0) {
              description = allText[0];
            }

            // Categorize the slide section
            if (hasContent && positionTitle) {
              result.slideAnalysis.slideSectionsWithContent.push({
                slideId: section.id,
                positionTitle: positionTitle,
                description: description.substring(0, 100) + '...',
                images: foundImages.length,
                index: index
              });
            } else {
              result.slideAnalysis.slideSectionsWithoutContent.push({
                slideId: section.id,
                textContent: section.textContent.substring(0, 100) + '...',
                index: index
              });
            }

            if (positionTitle) {
              result.slideAnalysis.potentialPositions.push(positionTitle);
            }
          });

          // Get all headings for comparison
          const allHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
          result.slideAnalysis.allHeadings = allHeadings.map((heading, index) => ({
            index,
            tag: heading.tagName,
            text: heading.textContent.trim(),
            className: heading.className,
            id: heading.id
          }));

          return result;
        }, position);

        analysisResults.push(analysis);

        console.log(`📊 Analysis Results:`);
        console.log(`   Total slide sections: ${analysis.slideAnalysis.allSlideSections.length}`);
        console.log(`   Slide sections with content: ${analysis.slideAnalysis.slideSectionsWithContent.length}`);
        console.log(`   Slide sections without content: ${analysis.slideAnalysis.slideSectionsWithoutContent.length}`);
        console.log(`   Potential positions found: ${analysis.slideAnalysis.potentialPositions.length}`);
        console.log(`   All headings: ${analysis.slideAnalysis.allHeadings.length}`);
        
        const successRate = ((analysis.slideAnalysis.slideSectionsWithContent.length / position.expectedCount) * 100).toFixed(1);
        console.log(`   Success Rate: ${successRate}%`);
        
        if (analysis.slideAnalysis.slideSectionsWithContent.length >= position.expectedCount) {
          console.log(`   ✅ SUCCESS: All positions found!`);
        } else {
          console.log(`   ❌ MISSING: ${position.expectedCount - analysis.slideAnalysis.slideSectionsWithContent.length} positions`);
        }

        // Show sample positions found
        console.log(`   Sample positions found:`);
        analysis.slideAnalysis.slideSectionsWithContent.slice(0, 5).forEach((pos, index) => {
          console.log(`     ${index + 1}. ${pos.positionTitle} (${pos.slideId})`);
        });

        // Show slide sections without content
        if (analysis.slideAnalysis.slideSectionsWithoutContent.length > 0) {
          console.log(`   Slide sections without content:`);
          analysis.slideAnalysis.slideSectionsWithoutContent.slice(0, 3).forEach((slide, index) => {
            console.log(`     ${index + 1}. ${slide.slideId}: "${slide.textContent}"`);
          });
        }

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
    fs.writeFileSync('slide-sections-analysis.json', JSON.stringify(analysisResults, null, 2));
    console.log(`\n🎉 Analysis saved to slide-sections-analysis.json`);

    // Print summary
    console.log('\n📊 SLIDE SECTIONS ANALYSIS SUMMARY:');
    let totalExpected = 0;
    let totalFound = 0;
    let totalSlideSections = 0;
    
    analysisResults.forEach((result, index) => {
      if (result.error) {
        console.log(`${index + 1}. ${result.category}: ERROR - ${result.error}`);
      } else {
        const found = result.slideAnalysis.slideSectionsWithContent.length;
        const expected = result.expectedCount;
        const slideSections = result.slideAnalysis.allSlideSections.length;
        const successRate = ((found / expected) * 100).toFixed(1);
        
        totalExpected += expected;
        totalFound += found;
        totalSlideSections += slideSections;
        
        console.log(`${index + 1}. ${result.category}: ${found}/${expected} (${successRate}%) - ${slideSections} slide sections`);
        
        if (found < expected) {
          console.log(`   ❌ Missing ${expected - found} positions`);
        }
      }
    });

    const overallSuccessRate = ((totalFound / totalExpected) * 100).toFixed(1);
    console.log(`\n🎯 OVERALL: ${totalFound}/${totalExpected} (${overallSuccessRate}%) from ${totalSlideSections} slide sections`);
    console.log(`📁 Detailed analysis saved to: slide-sections-analysis.json`);

  } catch (error) {
    console.error('Error during slide sections analysis:', error);
  } finally {
    await browser.close();
  }
}

// Run the slide sections analysis
analyzeSlideSections();
