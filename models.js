'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Define a schema

const sortAnswers = (a, b) => {
    // - negative a before b,  0 no change,  + positive a after b
    if (a.votes === b.votes) {
        // will order the later dates first
        return b.updatedAt - a.updatedAt;
    }
    // will order the larger votes first
    return b.votes - a.votes;
}

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

// When the answer is updated:
// 1. we want to apply the updates to unanswered document
// 2. we want the answers updated property to be the current time
// We can call instance update method directly on the answer when we want to update it
AnswerSchema.method('update') = function (updates, callback) {
    // merge the updates into the answers document
    Object.assign(this, updates, {updatedAt: new Date()});
    // saves the parent document, the question associated with the answer;
    // to access the question we can use the answers parent method
    this
        .parent()
        .save(callback);
}

// vote instance method to help with translating strings from the URL into math
// that moves the counts up or down
AnswerSchema.method('vote') = function (votes, callback) {
    if (vote === 'up') {
        this.votes += 1;
    } else {
        this.votes -= 1;
    }
    // we need to save the parent and pass in the callback to save
    this
        .parent()
        .save(callback);
}

// pre-save hook
QuestionSchema.pre('save', function (next) {
    this
        .answers
        .sort(sortAnswers); // Mongoose will sort the answers every time it is saved keeping the state of ur DB up to date
    next();
});

// To use our schema definition, we need to convert our QuestionSchema into a
// Model we can work with
const Question = mongoose.model('Question', QuestionSchema);

module.exports.Question = Question;