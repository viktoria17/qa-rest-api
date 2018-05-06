'use strict';

const express = require('express');
const router = express.Router();
const Question = require('./models').Question;

// Express allows us to trigger a handler whenever a URL parameter is present.
// In our case if qID exists, we can preload the question document in the handler 
// so it will be present on any matching route 
router.param('qID', function(req, res, next, id) { // this callback will get executed when qID is present
  Question.findById(id, function(err, doc) {
    if (err) return next(err);
    if (!doc) {
      err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }
    // If document exists set it on the request object, so it can be used in other middleware
    // and route handlers that receive this request.
    req.question = doc;
    return next();
  });
}); 

// For the specific answer route, anothe parameter handler would be useful to preload answer documents.
router.param('aID', function(req, res, next, id) { // this callback will get executed when qID is present
  // the id() method takes an ID of a sib-document and returns the sub-document with that matching ID
  req.answer = req.question.answers.id(id);
  if (!req.answer) {
    err = new Error('Not Found');
    err.status = 404;
    return next(err);
  }
  next();
});

// /questions
router.get('/', function(req, res, next){
  // we want the API to return all question document
  Question.find({})
    .sort({createdAt: -1})
    .exec(function(err, questions) { // executes the query and calls the callback function
      if (err) return next(err);
      res.json(questions);
    });
});

// /questions
router.post('/', (req, res, next) => {
  // To create a new question document from the incoming JSON on the request body,
  // we can pass in directly to the model constructor.
  const question = new Question(req.body);

  question.save(function(err, question) {
    if (err) return next(err);
    res.status(201); // tells the client that the resource was successfully created
    res.json(question); // sends response back to the client
  });
});

// /questions/7
router.get('/:qID', (req, res, next) => {
  // sends out the document to the client
  res.json(req.question);
});

// Route for creating an answer /questions/7/answers
router.post('/:qID/answers/', (req, res, next) => {
  // Since we're already having the question loaded by the param method, 
  // we don't need to type a query for for each route, it's just in the request.

  // Get the reference to the pre-loaded question, access the collection of answers 
  // and push the object literal version of the document we want to add.
  req.question.answers.push(req.body);
  // To save the document that Mongoose created for us, we need to call save on the question document.
  req.question.save(function(err, question) {
    if (err) return next(err);
    res.status(201);
    res.json(question);
  });
});

// Edit a specific answer /questions/7/answers/1
router.put('/:qID/answers/:aID', (req, res) => {
  // When the answer is loaded let's use it in our put route
  req.answer.update(req.body, function(err, result) {
    if (err) return next(err);
    res.json(result); // send the result in question document back to the client
  });
});

// Delete a specific answer /questions/7/answers/1
router.delete('/:qID/answers/:aID', (req, res) => {
  req.answer.remove(function(err) {
    req.question.save(function(err, question) {
      if (err) return next(err);
      res.json(question);
    });
  });
});

// Vote on a specific answer 
// /questions/7/answers/1/vote-up or /questions/7/answers/1/vote-down
router.post("/:qID/answers/:aID/vote-:dir", 
	function(req, res, next){
		if(req.params.dir.search(/^(up|down)$/) === -1) {
			var err = new Error("Not Found");
			err.status = 404;
			next(err);
		} else {
      // We put the vote string directly on the object, it allows the reader to quickly understand what the value
      // of the variable is about when they read it in the next callback function.
			req.vote = req.params.dir;
			next();
		}
	}, 
	function(req, res, next){
		req.answer.vote(req.vote, function(err, question){
			if(err) return next(err);
			res.json(question);
		});
});

module.exports = router;