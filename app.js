'use strict';

const express = require('express');
const app = express();
const routes = require('./routes');
const jsonParser = require('body-parser').json;

app.use(jsonParser());

app.use('/questions', routes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log('Express server is listening on localhost:' + port);
});