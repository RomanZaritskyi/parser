const puppeteer = require('puppeteer-extra');
const { searchAndExtractData } = require('./searchEndExtractData.js');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());
require('dotenv').config();

const url = 'https://booking.com';

const scrapeLogic = async (res, city) => {
	const browser = await puppeteer.launch({
		headless: false,
		// args: [
		// 	'--disable-setuid-sandbox',
		// 	'--no-sandbox',
		// 	'--single-process',
		// 	'--no-zygote',
		// ],
		executablePath:
			process.env.NODE_ENV === 'production'
				? process.env.PUPPETEER_EXECUTABLE_PATH
				: puppeteer.executablePath(),
	});

	try {
		const page = await browser.newPage();
		await page.setViewport({ width: 1920, height: 1080 });
		await page.setGeolocation({
			latitude: 50.4501,
			longitude: 30.5234,
		});

		await page.setRequestInterception(true);

		// interceptors;
		page.on('request', (req) => {
			if (req.url().endsWith('.png') || req.url().endsWith('.jpg')) {
				req.abort();
			} else if (req.resourceType() === 'image') {
				req.abort();
			} else {
				req.continue();
			}
		});

		await page.goto(url, { waitUntil: 'domcontentloaded' });
		await new Promise((r) => setTimeout(r, 5000));

		try {
			// close popup if it exist
			const poputSelector = 'div.c0528ecc22';
			const closePopupSelector = 'button[aria-label="Dismiss sign-in info."]';
			await page.waitForSelector(poputSelector, { timeout: 5000 }); // Adjust timeout as needed

			await page.evaluate(() => {
				document.querySelector(closePopupSelector).click();
			});
			const pageSource = await searchAndExtractData(page, city);
			return pageSource;
		} catch (error) {
			console.log("Pop-up didn't appear. Moving on.");
			const pageSource = await searchAndExtractData(page, city);
			return pageSource;
		}
	} catch (e) {
		console.error(e);
		return `Something went wrong while running Puppeteer: ${e}`;
	} finally {
		await browser.close();
	}
};

module.exports = { scrapeLogic };
