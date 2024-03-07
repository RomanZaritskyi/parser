const { ZenRows } = require('zenrows');
const cheerio = require('cheerio');

async function getInfo(place) {
	const client = new ZenRows('607e809eb2f96d02b07e045f8203cb5862e256ed');
	const url = `https://www.booking.com/searchresults.html?ss=${place.city}&checkin=${place.startDate}&checkout=${place.endDate}`;

	try {
		const { data } = await client.get(url, {
			premium_proxy: 'true',
		});
		const $ = cheerio.load(data);
		const info = $('h1.f6431b446c.d5f78961c3').text();

		return info;
	} catch (error) {
		console.error(error.message);
		if (error.response) {
			console.error(error.response.data);
		}
	}
}

module.exports = { getInfo };
