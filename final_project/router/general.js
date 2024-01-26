const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	if (username && password) {
		if (!isValid(username)) {
			users.push({ username: username, password: password });
			return res
				.status(200)
				.json({ message: 'User successfully registered. You can now login' });
		} else {
			return res.status(404).json({ message: 'User already exists!' });
		}
	}
	return res.status(404).json({ message: 'Unable to register user.' });
});

public_users.get('/', function (req, res) {
	try {
		const bookList = books;
		res.json(bookList); // Neatly format JSON output
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error retrieving book list' });
	}
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
	try {
		const booksAsync = await getBooks();
		res.send(JSON.stringify(booksAsync, null, 4));
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
	const isbn = req.params.isbn;
	res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
	const author = req.params.author;
	const keys = [];
	for (const [key, _] of Object.entries(books)) {
		keys.push(key);
	}
	keys.forEach((el) => {
		if (author === books[el].author) {
			res.send(books[el]);
		}
	});
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
	const title = req.params.title;
	const keys = [];
	for (const [key, _] of Object.entries(books)) {
		keys.push(key);
	}
	keys.forEach((el) => {
		if (title === books[el].title) {
			res.send(books[[el]]);
		}
	});
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
	const isbn = req.params.isbn;
	res.send(books[isbn].reviews);
});

module.exports.general = public_users;
