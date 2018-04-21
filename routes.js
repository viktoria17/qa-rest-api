'use strict';

const express = require('express');
const router = express.Router();

// /questions
router.get('/', (req, res) => {
  res.json({
    response: 'You sent me a GET request to /questions'
  });
});

// /questions
router.post('/', (req, res) => {
  res.json({
    response: 'You sent me a POST request to /questions',
    body: req.body
  });
});

// /questions/7
router.get('/:qID', (req, res) => {
  res.json({
    response: 'You sent me a GET request to /questions with ID ' + req.params.qID
  });
});

// /questions/7/answers/1
router.get('/:qID/answers/:aID', (req, res) => {
  res.json({
    response: 'You sent me a GET request to /answers',
    questionId: req.params.qID,
    answerID: req.params.aID
  });
});

// Route for creating an answer /questions/7/answers
router.post('/:qID/answers/', (req, res) => {
  res.json({
    response: 'You sent me a POST request to /answers',
    questionID: req.params.qID,
    body: req.body
  });
});

// Edit a specific answer /questions/7/answers/1
router.put('/:qID/answers/:aID', (req, res) => {
  res.json({
    response: 'You sent me a PUT request to /answers',
    questionID: req.params.qID,
    answerID: req.params.aID,
    body: req.body
  });
});

// Delete a specific answer /questions/7/answers/1
router.delete('/:qID/answers/:aID', (req, res) => {
  res.json({
    response: 'You sent me a DELETE request to /answers',
    questionID: req.params.qID,
    answerID: req.params.aID
  });
});

// Vote on a specific answer 
// /questions/7/answers/1/vote-up or /questions/7/answers/1/vote-down
router.post('/:qID/answers/:aID/vote-:dir', (req, res, next) => {
  if(req.params.dir.search(/^(up|down)$/) === -1) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  } else {
    next();
  }
}, (req, res) => {
  res.json({
    response: 'You sent me a POST request to /vote-' + req.params.dir,
    questionID: req.params.qID,
    answerID: req.params.aID,
    vote: req.params.dir,
  });
});

module.exports = router;