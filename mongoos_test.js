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
    size: String,
    mass: {type: Number, defaut: 50},
    name: {type: String, defaut: 'Warik'}
  });
  // we are passing callback so it can plug into the query inside the func to preserve the flow of our overall application 
  AnimalSchema.statics.findSize = function(size, callback) {
    return this.find({size: size}, callback); // this === Animal
  }

  // To use our schema definition, we need to convert our AnimalSchema into a Model we can work with
  const Animal = mongoose.model('Animal', AnimalSchema);

  // pre-save hook 
  AnimalSchema.pre('save', function(next) {
    if (this.mass >= 100) {
      this.size = 'big';
    } else if (this.mass > 49 && this.mass < 100) {
      this.size = 'medium';
    } else {
      this.size = 'small';
    }
    next();
  });

  // Create animal document
  const tiger = new Animal({
    type: 'tiger',
    color: 'orange',
    mass: 130,
    name: 'Mimi'
  });

  const dog = new Animal({});

  const cat = new Animal({
    type: 'cat',
    mass: 2,
    name: 'Pi'
  });

  const animalData = [
    {
      type: 'wolf',
      color: 'gray',
      mass: 48,
      name: 'Charli'
    },
    {
      type: 'pig',
      color: 'rose',
      mass: 100,
      name: 'Piggy'
    },
    {
      type: 'elephant',
      color: 'gray',
      mass: 200,
      name: 'Oli'
    },
    tiger,
    dog,
    cat
  ]

  // we ask model to emty our animals collection before we save anything
  Animal.remove({}, (err) => {
    if (err) console.error('Save Failed: ', err);
    Animal.create(animalData, (err, animals) => {
      if (err) console.error('Save Failed: ', err);
      Animal.findSize('big', (err, animals) => {
        animals.forEach(animal => {
          console.log(animal.name + ' is ' + animal.size + '-sized.');
        });
        db.close(() => {
          console.log('DB connection closed!');
        });
      });
    });
  });
});