const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function getProxies() {
	const url = `https://www.us-proxy.org/`;
	const proxiesArray = [];

	try {
		const { data } = await axios.get(url);
		const $ = cheerio.load(data);

		const container = $('div.table-responsive.fpl-list');
		const table = container.find('table');
		const tableBodyRow = table.find('tbody tr');

		tableBodyRow.each((index, element) => {
			const host = $(element).find('td:nth(0)').text();
			const port = $(element).find('td:nth(1)').text();

			const proxy = {
				protocol: 'http',
				host,
				port,
			};
			proxiesArray.push(proxy);
		});

		console.log(proxiesArray);
		return proxiesArray;
	} catch (error) {
		console.error(error.message);
		if (error.response) {
			console.error(error.response.data);
		}
	}
}

getProxies();

module.exports = { getProxies };
