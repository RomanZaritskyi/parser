const puppeteer = require('puppeteer');
const { searchAndExtractData } = require('./searchEndExtractData.js');
require('dotenv').config();

const url = 'https://booking.com';

const scrapeLogic = async (res, city) => {
	const browser = await puppeteer.launch({
		args: [
			'--disable-setuid-sandbox',
			'--no-sandbox',
			'--single-process',
			'--no-zygote',
		],
		executablePath:
			process.env.NODE_ENV === 'production'
				? process.env.PUPPETEER_EXECUTABLE_PATH
				: puppeteer.executablePath(),
	});

	try {
		const page = await browser.newPage();

		// await page.setRequestInterception(true);

		// interceptors
		// page.on('request', (req) => {
		// 	if (req.url().endsWith('.png') || req.url().endsWith('.jpg')) {
		// 		req.abort();
		// 	} else if (req.resourceType() === 'image') {
		// 		req.abort();
		// 	} else {
		// 		req.continue();
		// 	}
		// });

		await page.goto(url, { waitUntil: 'domcontentloaded' });

		// ----------- Set screen size
		await page.setViewport({ width: 1080, height: 1024 });

		// close popup if it exist
		const poputSelector = 'div.c0528ecc22';
		const closePopupSelector = 'button[aria-label="Dismiss sign-in info."]';
		const popup = await page.waitForSelector(poputSelector, { timeout: 3000 });

		if (popup) {
			console.log('need to close');
			const closePopupBtn = await popup.waitForSelector(closePopupSelector);
			await closePopupBtn.click();
			const pageSource = await searchAndExtractData(page, city);
			return pageSource;
		} else {
			console.log('there is no popup');
			const pageSource = await searchAndExtractData(page, city);
			return pageSource;
		}
	} catch (e) {
		console.error(e);
		return `Something went wrong while running Puppeteer: ${e}`;
	} finally {
		// await browser.close();
	}
};

module.exports = { scrapeLogic };
