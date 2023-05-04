// Destructing the Schema and model
const { Schema, model } = require('mongoose');

// creating a new Schema, same thing as mongoose.Schema
const fruitSchema = new Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  readyToEat: Boolean,
});

// creating a new model, same thing as mongoose.model
const Fruit = model('Fruit', fruitSchema);

module.exports = Fruit;