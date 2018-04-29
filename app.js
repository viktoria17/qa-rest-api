'use strict';

const express = require('express');
const app = express();
const routes = require('./routes');

const jsonParser = require('body-parser').json;
const logger = require('morgan');

app.use(logger('dev'));
app.use(jsonParser());

const mongoose = require('mongoose');

// Opens a connection to the qa db on our locally running instance of MongoDB.
mongoose.connect('mongodb://localhost:27017/qa');

// Pending connection to the test database running on localhost
const db = mongoose.connection;

// We  need to get notified if we connect successfully or if a connection error occurs
db.on('error', err => {
  console.error('Connection error: ', err)
});

db.once('open', () => {
  console.log('DB is connected!');
});

app.use('/questions', routes);

// catch 404 error and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Error Handler
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({
		 error: {
			 message: err.message 
		}
	});
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log('Express server is listening on localhost:' + port);
});