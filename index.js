const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session'); // Add this line
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

// Use express-session middleware
app.use(
	session({
		secret: 'secret', // Change this to a secret key
		resave: false,
		saveUninitialized: true,
	})
);

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
	console.log(places, startDate, endDate);

	// Render the places template and pass the 'info' array to it
	res.render('places', { placesInfo });
});

// Handle login logic
app.post('/login', (req, res) => {
	const { username, password } = req.body;
	console.log(username);
	// Validate the username and password (e.g., against a database)
	if (username === 'admin' && password === 'admin') {
		// If valid, set a session or JWT to keep the user logged in
		req.session.user = username; // Example of setting a session
		res.redirect('/');
	} else {
		res.status(401).send('Invalid username or password');
	}
});

app.get('/auth', (req, res) => {
	res.sendFile(path.join(__dirname, 'templates', 'login.html'));
});

// Serve the form from the 'templates' folder
app.get('/', (req, res) => {
	// Check if the user is logged in
	if (req.session?.user) {
		// Render the main page with the second form
		res.sendFile(path.join(__dirname, 'templates', 'form.html'));
	} else {
		// Redirect to the login page if not logged in
		res.redirect('/auth');
	}
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
