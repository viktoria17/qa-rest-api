'use strict';

const express = require('express');
const app = express();

// localhost:3000
app.use((req, res, next) => {
	console.log('First piece of Middleware');
	next();
});

// localhost:3000
app.use((req, res, next) => {
	console.log('Second piece of Middleware');
	next();
});

// localhost:3000/test/1
app.use('/test/:id', (req, res, next) => {
	console.log('ID: ' + req.params.id);
	next();
});

// localhost:3000
app.use((req, res, next) => {
	req.myMessage = 'Hi!';
	next();
});

// localhost:3000
app.use((req, res, next) => {
	console.log(req.myMessage);
	next();
});

// localhost:3000/?color=green
app.use((req, res, next) => {
	console.log('My favorite color is ' + req.query.color);
	next();
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log('Express server is listening on localhost:' + port);
});