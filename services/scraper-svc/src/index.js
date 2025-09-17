import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
app.use(express.json());

app.post('/scrape/bdsm-results/:testId', async (req, res) => {
  const { testId } = req.params;
  try {
    const url = `https://bdsmtest.org/r/${testId}`;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    // TODO: Add scraping logic to extract results from the page
    // For now, return a placeholder
    const results = [{ name: 'Dominant', percentage: 80 }, { name: 'Submissive', percentage: 20 }];
    await browser.close();
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Scraper service running on port ${PORT}`);
});
