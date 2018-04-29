'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Define a schema

const AnswerSchema = new Schema({
    text: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    votes: {
        type: Number,
        default: 0
    }
});

const QuestionSchema = new Schema({
    text: String,
    // whenever a question is created using the schema, the current dates and time
    // will automatically be supplied for this field
    createdAt: {
        type: Date,
        default: Date.now
    },
    answers: [AnswerSchema]

});

// To use our schema definition, we need to convert our QuestionSchema into a
// Model we can work with
const Question = mongoose.model('Question', QuestionSchema);

module.exports.Question = Question;