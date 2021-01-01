const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'the tour must have a name'],
    unique: true,
    trim: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'the tour must have a price'],
  },
  priceDiscount: Number,
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'the rating Average cannot be less than 1'],
    max: [5, 'the rating Average cannot be more than 5'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  images: [String],
  duration: {
    type: Number,
    required: [true, 'A Tour must have a duration'],
  },
  startDates: [Date],
  maxGroupSize: {
    type: Number,
    required: [true, 'A Tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'the tour must have a difficulty'],
    enum: ['easy', 'medium', 'difficult'],
  },
  summary: {
    type: String,
    required: [true, 'A tour must have a summary'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  imageCover: {
    type: String,
    required: [true, 'A Tour must have a imageCover'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
