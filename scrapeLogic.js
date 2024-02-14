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

		// Set screen size
		await page.setViewport({ width: 1080, height: 1024 });

		// setTimeout(async () => {
		// Close popup
		// const popup = await page.$('div.eb33ef7c47');
		// if (popup) {
		// 	const closeBtn = await popup.$(
		// 		'button[aria-label="Dismiss sign-in info."]'
		// 	);
		// 	await closeBtn.click();
		// }

		// Search input -----------------------------
		const searchInput = await page.$('input.eb46370fe1');
		await searchInput.focus();
		await searchInput.type('Lviv');

		// Search btn------------------------------------------
		// await page.evaluate(() => {
		// 	const btn = document.querySelector('button[type="submit"]');
		// 	btn.click();
		// });
		const submitButtoSelector =
			'button.a83ed08757.c21c56c305.a4c1805887.f671049264.d2529514af.c082d89982.cceeb8986b';
		await page.waitForSelector(submitButtoSelector);
		await page.click(submitButtoSelector);

		await page.waitForNavigation({ waitUntil: 'networkidle2' });

		// Get places
		const palcesSelector = await page.waitForSelector('div.ac864a506a');
		const amounOfPlaces = await palcesSelector?.evaluate(
			(el) => el.textContent
		);

		// test HTML output ---------------------------------------------
		// const pageSource = await page.content();
		// fs.writeFileSync('pageSource.html', pageSource, 'utf8');
		// console.log('Page source saved to pageSource.html');

		// const info = await page.$eval(
		// 	'div.bui-f-font-display_two.sr-snippet_header_num_properties',
		// 	(el) => el.textContent
		// );
		// console.log(info);

		await browser.close();

		res.send(amounOfPlaces);
		// }, 3000);
	} catch (e) {
		console.error(e);
		res.send(`Something went wrong while running Puppeteer: ${e}`);
	}
};

module.exports = { scrapeLogic };
