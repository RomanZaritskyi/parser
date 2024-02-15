const puppeteer = require('puppeteer');
require('dotenv').config();
const fs = require('fs');

const url = 'https://booking.com';

const cities = ['Paris', 'London', 'Lviv'];

const scrapeLogic = async (res) => {
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
		setTimeout(async () => {
			// -----------Search input -----------------------------
			const searchInputSelector = 'input.eb46370fe1';
			await page.type(searchInputSelector, 'Lviv');

			// -----------Select dates ---------------------------------------
			const dateContainerSelector = 'div.f73e6603bf';
			await page.waitForSelector(dateContainerSelector, { timeout: 60000 });
			await page.click(dateContainerSelector);

			// -----------Checkin date--------------------------------
			const dateSelector = 'span[data-date="2024-02-16"]';
			await page.waitForSelector(dateSelector, { timeout: 60000 });
			await page.click(dateSelector);

			// ----------Checkout date------------------
			const dateSelector2 = 'span[data-date="2024-02-20"]';
			await page.waitForSelector(dateSelector2, { timeout: 60000 });
			await page.click(dateSelector2);

			// ---------------Search btn------------------------------------------
			// const submitButtoSelector =
			// 	'button.a83ed08757.c21c56c305.a4c1805887.f671049264.d2529514af.c082d89982.cceeb8986b';
			// await page
			// 	.waitForSelector(submitButtoSelector)
			// 	.then(() => page.click(submitButtoSelector));
			// await page.click(submitButtoSelector);

			// --------------Wait for navigation -------------------
			// await page.waitForNavigation({ waitUntil: 'networkidle2' });

			// --------------Get places-----------------------------------------------
			// const palcesSelector = await page.waitForSelector('div.ac864a506a');
			// const amounOfPlaces = await palcesSelector?.evaluate(
			// 	(el) => el.textContent
			// );

			// test HTML output ---------------------------------------------
			const pageSource = await page.content();
			// fs.writeFileSync('pageSource.html', pageSource, 'utf8');
			// console.log('Page source saved to pageSource.html');

			await browser.close();

			res.send(pageSource);
		}, 2000);
	} catch (e) {
		console.error(e);
		res.send(`Something went wrong while running Puppeteer: ${e}`);
	}
};

module.exports = { scrapeLogic };
