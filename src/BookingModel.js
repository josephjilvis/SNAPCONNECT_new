const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  photographerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Photographer', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingDate: { type: Date, required: true },
  location: { type: String, required: true },
  rate: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected',`Cancelled`], default: 'Pending' }, // Added status field
});


const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;

