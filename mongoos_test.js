'use strict';

const mongoose = require('mongoose');

// Opens a connection to the test db on our locally running instance of MongoDB.
mongoose.connect('mongodb://localhost:27017/test');

// Pending connection to the test database running on localhost
const db = mongoose.connection;

// We  need to get notified if we connect successfully or if a connection error occurs
db.on('error', err => {
  console.error('Connection error: ', err)
});

db.once('open', () => {
  console.log('DB is connected!');

  // Define a schema
  const Schema = mongoose.Schema;
  const AnimalSchema = new Schema({
    type: String,
    color: String,
    size: String,
    mass: Number,
    name: String
  });

  // To use our schema definition, we need to convert our AnimalSchema into a Model we can work with
  const Animal = mongoose.model('Animal', AnimalSchema);

  // Create animal document
  const tiger = Animal({
    type: 'tiger',
    color: 'orange',
    size: 'medium',
    mass: 130,
    name: 'Mimi'
  });

  // Save is an asyncronous method, our app will call save method first 
  // and then call close right away before save can finish, causing it to fail
  // Into the save method we need to pass in a callback func and then close the DB connection from inside the callback
  tiger.save((err) => {
    if (err) console.error('Save Failed: ', err);
    else console.log('Saved!');
    db.close(() => {
      console.log('DB connection closed!');
    });
  }); 
});