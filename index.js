const express = require('express');
const { scrapeLogic } = require('./scrapeLogic');
const { getInfo } = require('./zenRows.js');
const { getProxies } = require('./getProxies.js');
const app = express();

const PORT = process.env.PORT || 4000;

app.get('/scrape', async (req, res) => {
	const cities = ['Paris'];
	const placesInfo = [];

	for (const city of cities) {
		const info = await scrapeLogic(res, city);
		placesInfo.push(info);
	}

	res.send(placesInfo[0]);
});

app.get('/test', async (req, res) => {
	const cities = ['Paris', 'Lviv', 'London'];
	const placesInfo = [];

	for (const city of cities) {
		const info = await getInfo(city);
		placesInfo.push(info);
	}

	res.send(`
	<ol>
		${placesInfo.map((item) => `<li>${item}</li>`)}
	</ol>`);
});

app.get('/proxies', async (req, res) => {
	const proxies = await getProxies();
	res.json({ proxies });
});

app.get('/', (req, res) => {
	res.send('Render Puppeteer server is up and running!');
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
