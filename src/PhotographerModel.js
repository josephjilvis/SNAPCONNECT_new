const mongoose = require('mongoose');

const photographerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  location: String,
  price: { type: Number }, // Ensure this is a Number
  bio: String,
  portfolio: String,
  testimonials: String,
  availability: String,
  contact: String,
  specializations: String,
  image: String,
});


module.exports = mongoose.model('Photographer', photographerSchema);
