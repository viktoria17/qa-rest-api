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
    type: {type: String, defaut: 'dog'},
    color: {type: String, defaut: 'black'},
    size: {type: String, defaut: 'big'},
    mass: {type: Number, defaut: 50},
    name: {type: String, defaut: 'Warik'}
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

  const dog = new Animal({});

  const cat = Animal({
    type: 'cat',
    size: 'small',
    mass: 2,
    name: 'Pi'
  });

  // we ask model to emty our animals collection before we save anything
  Animal.remove({}, (err) => {
    if (err) console.error('Save Failed: ', err);
    // we want all the save actions to take place after the removal
    tiger.save((err) => {
      if (err) console.error('Save Failed: ', err);
      dog.save((err) => {
        if(err) console.log('Save Failed: ', err);
        cat.save((err) =>{
          if (err) console.error('Save Failed: ', err);
          Animal.find({size:'medium'}, (err, animals) => {
            animals.forEach(animal => {
              console.log(animal.name);
            });
            db.close(() => {
              console.log('DB connection closed!');
            });
          });
        });
      });
    }); 
  });
});