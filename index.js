const express = require('express');
const { scrapeLogic } = require('./scrapeLogic');
const app = express();

const PORT = process.env.PORT || 4000;

app.get('/scrape', async (req, res) => {
	const cities = ['Paris'];
	const placesInfo = [];
	for (const city in cities) {
		const info = await scrapeLogic(res, city);
		placesInfo.push(info);
	}
	res.send(`<ul>${placesInfo.map((item) => `<li>${item}</li>`)}</ul>`);
});

app.get('/', (req, res) => {
	res.send('Render Puppeteer server is up and running!');
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
