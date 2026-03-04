const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/qr', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.send("Missing URL");

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForSelector('img');
    const element = await page.$('img');
    const buffer = await element.screenshot();
    await browser.close();

    res.set('Content-Type', 'image/png');
    res.send(buffer);
});

app.listen(process.env.PORT || 3000, () => console.log("QR API running"));
