const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./UserModel');
const Booking = require('./BookingModel');
const Photographer = require('./PhotographerModel');
const authenticate = require('./middleware/authenticate'); // Authentication middleware

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors({
  origin: 'https://AKASH1948.github.io'  // Your GitHub Pages URL
}));

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware to verify JWT token
app.use('/update-photographer', authenticate);
app.use('/photographer-bookings', authenticate);

// Route to register a new user
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route for user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for photographer login
app.post('/photographer-login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const photographer = await Photographer.findOne({ email });
    if (!photographer) return res.status(400).json({ error: 'Photographer not found' });
    const isMatch = await bcrypt.compare(password, photographer.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: photographer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, photographerId: photographer._id });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to register a new photographer
app.post('/register-photographer', upload.single('image'), async (req, res) => {
  const { name, email, password, location, price, bio, portfolio, testimonials, availability, contact, specializations } = req.body;
  const image = req.file ? req.file.path : '';
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required' });
  try {
    const existingPhotographer = await Photographer.findOne({ email });
    if (existingPhotographer) return res.status(400).json({ error: 'Photographer already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newPhotographer = new Photographer({ name, email, password: hashedPassword, location, price, bio, portfolio, testimonials, availability, contact, specializations, image });
    await newPhotographer.save();
    const token = jwt.sign({ id: newPhotographer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'Photographer registered successfully', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to get all photographers
app.get('/photographers', async (req, res) => {
  try {
    const photographers = await Photographer.find();
    res.json(photographers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get a single photographer by ID
app.get('/photographer/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const photographer = await Photographer.findById(id);
    if (!photographer) return res.status(404).json({ error: 'Photographer not found' });
    res.json(photographer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to add a new photographer
app.post('/add-photographer', upload.single('image'), async (req, res) => {
  const { name, email, location, price, bio, portfolio, testimonials, availability, contact, specializations, password } = req.body;
  try {
    let photographer = await Photographer.findOne({ email });
    if (photographer) return res.status(400).json({ error: 'Photographer profile already exists' });
    const photographerData = { name, email, location, price, bio, portfolio, testimonials, availability, contact, specializations, image: req.file ? req.file.path : '', password };
    photographer = new Photographer(photographerData);
    await photographer.save();
    res.status(201).json({ message: 'Photographer added successfully', photographer });
  } catch (error) {
    console.error('Error adding photographer:', error);
    res.status(400).json({ error: 'Failed to add photographer', details: error.message });
  }
});

// Route to update photographer profile
app.put('/update-photographer/:id', authenticate, upload.single('image'), async (req, res) => {
  try {
    const photographer = await Photographer.findById(req.params.id);

    if (!photographer) {
      return res.status(404).json({ error: 'Photographer not found' });
    }

    // Update fields with new values
    photographer.name = req.body.name || photographer.name;
    photographer.location = req.body.location || photographer.location;
    photographer.price = req.body.price || photographer.price;
    photographer.bio = req.body.bio || photographer.bio;
    photographer.portfolio = req.body.portfolio || photographer.portfolio;
    photographer.testimonials = req.body.testimonials || photographer.testimonials;
    photographer.availability = req.body.availability || photographer.availability;
    photographer.contact = req.body.contact || photographer.contact;
    photographer.specializations = req.body.specializations || photographer.specializations;

    if (req.file) {
      photographer.image = req.file.path; // Save image path in database
    }

    await photographer.save();
    res.json(photographer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Route to book a photographer
app.post('/book-photographer', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { photographerId, userId, bookingDate, location, rate } = req.body;
    if (!photographerId || !userId || !bookingDate || !location || !rate) return res.status(400).json({ error: 'All fields are required' });
    const newBooking = new Booking({ photographerId, userId, bookingDate, location, rate });
    await newBooking.save();
    res.status(201).json({ message: 'Booking request sent successfully!' });
  } catch (error) {
    console.error('Error verifying token or saving booking:', error.message);
    return res.status(401).json({ error: 'Invalid token or failed to save booking' });
  }
});

// Route to delete a booking
app.delete('/delete-booking/:id', async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.status(200).json({ message: 'Booking deleted successfully!' });
  } catch (error) {
    console.error('Error deleting booking:', error.message);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// Route to get all bookings for the logged-in user
app.get('/my-bookings', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const bookings = await Booking.find({ userId }).populate('photographerId');
    if (bookings.length === 0) return res.status(404).json({ message: 'No bookings found' });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Backend route to update booking status
app.patch('/update-booking-status/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!status || !['Accepted', 'Rejected'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    console.error('Error verifying token or updating booking status:', error.message);
    return res.status(401).json({ error: 'Invalid token or failed to update status' });
  }
});


// Route to get all bookings for the photographer
app.get('/photographer-bookings/:id', authenticate, async (req, res) => { // Added authenticate middleware
  const { id } = req.params;
  try {
    const bookings = await Booking.find({ photographerId: id }).populate('userId');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
