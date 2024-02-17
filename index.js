const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const { getInfo } = require('./zenRows.js');

const PORT = process.env.PORT || 4000;

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle POST request to /places
app.post('/places', async (req, res) => {
	const { places, startDate, endDate } = req.body;
	const parsedPlaces = places.split(', ').map((city) => ({
		city,
		startDate,
		endDate,
	}));

	const placesInfo = [];

	for (const place of parsedPlaces) {
		const info = await getInfo(place);
		placesInfo.push(info);
	}

	return res.render('places', { placesInfo });
});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'templates', 'form.html'));
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
