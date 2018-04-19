'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
      response: 'You sent me a GET request'
    });
});

router.post('/', (req, res) => {
    res.json({
      response: 'You sent me a POST request',
      body: req.body
    });
});

router.get('/:id', (req, res) => {
    res.json({
      response: 'You sent me a GET request with ID ' + req.params.id,
    });
});

module.exports = router;