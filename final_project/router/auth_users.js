const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
	let userswithsamename = users.filter((user) => {
		return user.username === username;
	});
	if (userswithsamename.length > 0) {
		return true;
	} else {
		return false;
	}
};

const authenticatedUser = (username, password) => {
	let validusers = users.filter((user) => {
		return user.username === username && user.password === password;
	});
	if (validusers.length > 0) {
		return true;
	} else {
		return false;
	}
};

//only registered users can login
regd_users.post('/login', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	req.session.username = username;

	if (!username || !password) {
		return res.status(404).json({ message: 'Error logging in' });
	}

	if (authenticatedUser(username, password)) {
		let accessToken = jwt.sign(
			{
				data: password,
			},
			'access',
			{ expiresIn: 60 * 60 }
		);

		req.session.authorization = {
			accessToken,
			username,
		};
		return res.status(200).send('User successfully logged in');
	} else {
		return res
			.status(208)
			.json({ message: 'Invalid Login. Check username and password' });
	}
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
	const user = req.session.username;
	const isbn = req.params.isbn;
	const review = req.body.review;
	console.log(review);
	console.log(JSON.stringify(books[isbn].reviews) === '{}');
	if (JSON.stringify(books[isbn].reviews) === '{}') {
		books[isbn].reviews = {
			username: user,
			review: review,
		};
	}
	res.send(`Book review added by ${user}!`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
