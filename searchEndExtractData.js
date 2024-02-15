const { delay } = require('./helpers/delay.js');

const searchAndExtractData = async (page, city) => {
	// -----------Search input -----------------------------
	// const searchInputSelector = 'input.eb46370fe1';
	// await page.type(searchInputSelector, `${city}`);
	// delay(3000);
	// // -----------Select dates ---------------------------------------
	// const dateContainerSelector = 'div.f73e6603bf';
	// await page.waitForSelector(dateContainerSelector);
	// await page.click(dateContainerSelector);

	// // -----------Checkin date--------------------------------
	// const dateSelector = 'span[data-date="2024-02-16"]';
	// await page.waitForSelector(dateSelector);
	// await page.click(dateSelector);

	// // ----------Checkout date------------------
	// const dateSelector2 = 'span[data-date="2024-02-28"]';
	// await page.waitForSelector(dateSelector2);
	// await page.click(dateSelector2);

	// // ---------------Search btn------------------------------------------
	// const submitButtoSelector =
	// 	'button.a83ed08757.c21c56c305.a4c1805887.f671049264.d2529514af.c082d89982.cceeb8986b';
	// await page.waitForSelector(submitButtoSelector);
	// await page.click(submitButtoSelector);

	// --------------Wait for navigation -------------------
	// await page.waitForNavigation({ waitUntil: 'networkidle2' });

	// --------------Get places-----------------------------------------------
	// const palcesSelector = await page.waitForSelector('div.ac864a506a');
	// const amounOfPlaces = await palcesSelector?.evaluate((el) => el.textContent);

	// console.log(amounOfPlaces);

	// test HTML output ---------------------------------------------
	const pageSource = await page.content();
	return pageSource;
};

module.exports = { searchAndExtractData };
