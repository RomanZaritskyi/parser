const express = require('express');
const { scrapeLogic } = require('./scrapeLogic');
const { getInfo } = require('./test.js');
const app = express();

const PORT = process.env.PORT || 4000;

app.get('/scrape', async (req, res) => {
	const cities = ['Paris', 'Lviv', 'London'];
	const placesInfo = [];

	for (const city of cities) {
		const info = await scrapeLogic(res, city);
		placesInfo.push(info);
	}

	res.send(placesInfo[0]);
});

app.get('/test', (req, res) => {
	const info = getInfo();
	res.send(`<h1>${info}</h1>`);
});

app.get('/', (req, res) => {
	res.send('Render Puppeteer server is up and running!');
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
