const puppeteer = require('puppeteer');
require('dotenv').config();
const fs = require('fs');

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

		await page.goto(url);

		// ----------- Set screen size
		await page.setViewport({ width: 1080, height: 1024 });

		// -----------Search input -----------------------------
		const searchInputSelector = 'input.eb46370fe1';
		await page.type(searchInputSelector, `${city}`);

		// -----------Select dates ---------------------------------------
		const dateContainerSelector = 'div.f73e6603bf';
		await page.waitForSelector(dateContainerSelector, { timeout: 90000 });
		await page.click(dateContainerSelector);

		// -----------Checkin date--------------------------------
		const dateSelector = 'span[data-date="2024-02-16"]';
		await page.waitForSelector(dateSelector, { timeout: 90000 });
		await page.click(dateSelector);

		// ----------Checkout date------------------
		const dateSelector2 = 'span[data-date="2024-02-28]';
		await page.waitForSelector(dateSelector2, { timeout: 90000 });
		await page.click(dateSelector2);

		// ---------------Search btn------------------------------------------
		const submitButtoSelector =
			'button.a83ed08757.c21c56c305.a4c1805887.f671049264.d2529514af.c082d89982.cceeb8986b';
		await page.waitForSelector(submitButtoSelector);
		await page.click(submitButtoSelector);

		// --------------Wait for navigation -------------------
		await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 90000 });

		// --------------Get places-----------------------------------------------
		const palcesSelector = await page.waitForSelector('div.ac864a506a');
		const amounOfPlaces = await palcesSelector?.evaluate(
			(el) => el.textContent
		);

		// test HTML output ---------------------------------------------
		// const pageSource = await page.content();
		// fs.writeFileSync('pageSource.html', pageSource, 'utf8');
		// console.log('Page source saved to pageSource.html');

		await browser.close();

		// res.send(pageSource);
		return amounOfPlaces;
	} catch (e) {
		console.error(e);
		// res.send(`Something went wrong while running Puppeteer: ${e}`);
		return `Something went wrong while running Puppeteer: ${e}`;
	}
};

module.exports = { scrapeLogic };
